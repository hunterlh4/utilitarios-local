import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, ChevronRight, Search, Upload, Download } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import { downloadBase64File } from '@/common/lib/download-file';
import { useGetAllSteamItems } from '../search/hooks/useGetAllSteamItems.hook';
import { useGetAllSteamItemPurchases } from './hooks/useGetAllSteamItemPurchases.hook';
import { useAddSteamItemPurchase } from './hooks/useAddSteamItemPurchase.hook';
import { useUpdateSteamItemPurchase } from './hooks/useUpdateSteamItemPurchase.hook';
import { useDeleteSteamItemPurchase } from './hooks/useDeleteSteamItemPurchase.hook';
import { steamItemPurchaseService } from './services/steam-item-purchase.service';
import { getQualityByName } from '../shared/item-quality';
import type { SteamItemPurchase } from './models/steam-item-purchase.model';

interface PurchaseFormValues {
  steamItemId: string;
  purchasePrice: string;
  salePrice: string;
  quantity: string;
}

// Agrupa purchases por steamItemId
interface PurchaseGroup {
  steamItemId: number;
  itemName: string;
  itemImage: string;
  itemMarketUrl: string;
  itemGame: 1 | 2;
  items: SteamItemPurchase[];
  totalPurchase: number;
  totalSale: number;
  totalProfit: number;
  soldCount: number;
}

interface PurchasesByGame {
  dota: PurchaseGroup[];
  cs2: PurchaseGroup[];
}

const groupPurchases = (list: SteamItemPurchase[]): PurchaseGroup[] => {
  const map = new Map<number, PurchaseGroup>();
  for (const p of list) {
    if (!map.has(p.item.id)) {
      map.set(p.item.id, {
        steamItemId: p.item.id,
        itemName: p.item.name,
        itemImage: p.item.image,
        itemMarketUrl: p.item.marketUrl,
        itemGame: p.item.game ?? 1,
        items: [],
        totalPurchase: 0,
        totalSale: 0,
        totalProfit: 0,
        soldCount: 0,
      });
    }
    const g = map.get(p.item.id)!;
    g.items.push(p);
    g.totalPurchase += p.purchasePrice;
    g.totalSale += p.salePrice;
    if (p.profit != null) { g.totalProfit += p.profit; g.soldCount++; }
  }
  return Array.from(map.values());
};

const groupByGameThenItem = (list: SteamItemPurchase[]): PurchasesByGame => {
  const byGame = new Map<1 | 2, SteamItemPurchase[]>();

  for (const purchase of list) {
    const game = purchase.item.game === 2 ? 2 : 1;
    const current = byGame.get(game);
    if (current) {
      current.push(purchase);
    } else {
      byGame.set(game, [purchase]);
    }
  }

  return {
    dota: groupPurchases(byGame.get(1) ?? []),
    cs2: groupPurchases(byGame.get(2) ?? []),
  };
};

export const PurchasePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SteamItemPurchase | null>(null);
  const [form, setForm] = useState<PurchaseFormValues>({ steamItemId: '', purchasePrice: '', salePrice: '0', quantity: '1' });
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: steamItems } = useGetAllSteamItems();
  const { data: purchases, isLoading, refetch } = useGetAllSteamItemPurchases();
  const addMutation = useAddSteamItemPurchase();
  const updateMutation = useUpdateSteamItemPurchase();
  const deleteMutation = useDeleteSteamItemPurchase();

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await steamItemPurchaseService.exportExcel();
      downloadBase64File(file.base64, file.fileName || 'steam-purchase.xlsx');
      toast.success('Exportacion completada');
    } catch {
      toast.error('No se pudo exportar el archivo');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await steamItemPurchaseService.importExcel(file);
      await refetch();
      toast.success(
        `Importacion lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Invalidos: ${result.invalid}`
      );
    } catch {
      toast.error('No se pudo importar el archivo');
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ steamItemId: '', purchasePrice: '', salePrice: '0', quantity: '1' });
    setModalOpen(true);
  };

  const openEdit = (p: SteamItemPurchase) => {
    setEditing(p);
    setForm({ steamItemId: String(p.item.id), purchasePrice: String(p.purchasePrice), salePrice: String(p.salePrice), quantity: '1' });
    setModalOpen(true);
  };

  const handleItemSelect = (id: string) => {
    const item = steamItems?.find((i) => i.id === Number(id));
    setForm((f) => ({ ...f, steamItemId: id, purchasePrice: item?.price ? String(item.price) : '' }));
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: { steamItemId: Number(form.steamItemId), purchasePrice: parseFloat(form.purchasePrice), salePrice: parseFloat(form.salePrice) || 0 } },
        { onSuccess: () => { toast.success('Compra actualizada'); setModalOpen(false); }, onError: () => toast.error('Error al actualizar') }
      );
    } else {
      const qty = Math.max(1, parseInt(form.quantity) || 1);
      const payload = { steamItemId: Number(form.steamItemId), purchasePrice: parseFloat(form.purchasePrice) };
      try {
        for (let i = 0; i < qty; i++) {
          await addMutation.mutateAsync(payload);
        }
        toast.success(`${qty} compra${qty > 1 ? 's' : ''} registrada${qty > 1 ? 's' : ''}`);
        setModalOpen(false);
      } catch {
        toast.error('Error al registrar');
      }
    }
  };

  const filteredPurchases = (purchases ?? []).filter((purchase) =>
    purchase.item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByGame = groupByGameThenItem(filteredPurchases);
  const dota = groupedByGame.dota;
  const cs2 = groupedByGame.cs2;
  const totalGlobal = filteredPurchases.reduce((acc, p) => acc + (p.profit ?? 0), 0);

  const renderTable = (groups: PurchaseGroup[], title: string) => (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium">Item</th>
              <th className="text-center px-4 py-3 font-medium">Foto</th>
              <th className="text-center px-4 py-3 font-medium">Cant.</th>
              <th className="text-right px-4 py-3 font-medium">Compra total</th>
              <th className="text-right px-4 py-3 font-medium">Venta total</th>
              <th className="text-right px-4 py-3 font-medium">Ganancia</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {groups.map((g) => {
              const isOpen = expanded.has(g.steamItemId);
              return (
                <>
                  {/* Fila agrupada */}
                  <tr
                    key={g.steamItemId}
                    className="hover:bg-muted/30 cursor-pointer transition-colors group"
                    onClick={() => g.items.length > 1 ? toggleExpand(g.steamItemId) : openEdit(g.items[0])}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        {g.items.length > 1
                          ? (isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />)
                          : <span className="w-3.5" />
                        }
                        <a
                          href={g.itemMarketUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); }}
                          className="truncate max-w-55 font-medium hover:underline"
                        >
                          {g.itemName}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <a
                        href={g.itemMarketUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <img src={g.itemImage} alt={g.itemName} className="w-36 h-36 object-contain mx-auto" />
                      </a>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">{g.items.length}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">S/. {g.totalPurchase.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">{g.totalSale > 0 ? `S/. ${g.totalSale.toFixed(2)}` : '—'}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      {g.soldCount > 0 ? (
                        <span className={g.totalProfit >= 0 ? 'text-green-500' : 'text-destructive'}>
                          S/. {g.totalProfit.toFixed(2)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-2">
                      {g.items.length === 1 && (
                        <Button
                          size="icon" variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(g.items[0].id, { onSuccess: () => toast.success('Eliminado') }); }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>

                  {/* Filas individuales expandidas */}
                  {isOpen && g.items.map((p) => (
                    <tr
                      key={p.id}
                      className="bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors group"
                      onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                    >
                      <td className="px-4 py-2 pl-14">
                        <span className="text-xs text-muted-foreground">#{p.id}</span>
                      </td>
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2 text-right text-xs text-muted-foreground">S/. {p.purchasePrice}</td>
                      <td className="px-4 py-2 text-right text-xs text-muted-foreground">{p.salePrice > 0 ? `S/. ${p.salePrice}` : '—'}</td>
                      <td className="px-4 py-2 text-right text-xs font-medium">
                        {p.profit != null ? (
                          <span className={p.profit >= 0 ? 'text-green-500' : 'text-destructive'}>
                            S/. {p.profit.toFixed(2)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="icon" variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(p.id, { onSuccess: () => toast.success('Eliminado') }); }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compras Steam</h1>
        <div className="flex items-center gap-3">
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportExcel}
          />

          {totalGlobal !== 0 && (
            <span className={`text-sm font-semibold ${totalGlobal >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              Total: S/. {totalGlobal.toFixed(2)}
            </span>
          )}

          <div className="flex items-center overflow-hidden rounded-md">
            <Button onClick={openAdd} size="sm" className="rounded-none border-0">
              <Plus className="w-4 h-4 mr-1" /> Agregar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="default"
                  disabled={isExporting || isImporting}
                  className="rounded-none border-0 border-l border-primary-foreground/25 px-2"
                  aria-label="Abrir acciones de Excel"
                >
                  {isExporting || isImporting ? <Spinner className="h-4 w-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5 bg-primary">
                <DropdownMenuItem
                  onClick={handleExportExcel}
                  className="h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleImportClick}
                  className="mt-1 h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
                >
                  <Upload className="mr-2 h-4 w-4" /> Importar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar compra por item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : !filteredPurchases.length ? (
        <p className="text-sm text-muted-foreground">No hay resultados para la busqueda.</p>
      ) : (
        <div className="space-y-8">
          {dota.length > 0 && renderTable(dota, 'Dota 2')}
          {cs2.length > 0 && renderTable(cs2, 'CS2')}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar compra' : 'Registrar compra'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 max-h-105 overflow-y-auto">
              {steamItems?.map((item) => {
                const quality = getQualityByName(item.name);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(String(item.id))}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                      form.steamItemId === String(item.id)
                        ? 'border-primary'
                        : quality
                        ? `${quality.borderClass} opacity-80 hover:opacity-100`
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-28 object-contain" />
                  </div>
                );
              })}
            </div>

            {form.steamItemId && (
              <p className="text-xs text-muted-foreground">
                {steamItems?.find((i) => String(i.id) === form.steamItemId)?.name}
              </p>
            )}

            <div className={`grid gap-3 ${editing ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {!editing && (
                <div>
                  <Label>Cantidad</Label>
                  <Input type="number" min="1" value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
                </div>
              )}
              <div>
                <Label>Precio de compra (S/.)</Label>
                <Input type="number" step="0.01" value={form.purchasePrice}
                  onChange={(e) => setForm((f) => ({ ...f, purchasePrice: e.target.value }))} />
              </div>
              {editing && (
                <div>
                  <Label>Precio de venta (S/.)</Label>
                  <Input type="number" step="0.01" value={form.salePrice}
                    onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))} />
                </div>
              )}
            </div>

            {editing && parseFloat(form.salePrice) > 0 && (
              <p className="text-sm text-muted-foreground">
                Ganancia estimada:{' '}
                <span className={parseFloat(form.salePrice) - parseFloat(form.purchasePrice) >= 0 ? 'text-green-500 font-semibold' : 'text-destructive font-semibold'}>
                  S/. {(parseFloat(form.salePrice) - parseFloat(form.purchasePrice)).toFixed(2)}
                </span>
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.steamItemId || !form.purchasePrice || addMutation.isPending || updateMutation.isPending}
              >
                {addMutation.isPending || updateMutation.isPending ? 'Guardando...' : editing ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
