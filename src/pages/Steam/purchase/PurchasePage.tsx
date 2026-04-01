import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { useGetAllSteamItems } from '../search/hooks/useGetAllSteamItems.hook';
import { useGetAllSteamItemPurchases } from './hooks/useGetAllSteamItemPurchases.hook';
import { useAddSteamItemPurchase } from './hooks/useAddSteamItemPurchase.hook';
import { useUpdateSteamItemPurchase } from './hooks/useUpdateSteamItemPurchase.hook';
import { useDeleteSteamItemPurchase } from './hooks/useDeleteSteamItemPurchase.hook';
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
  itemGame: 1 | 2;
  items: SteamItemPurchase[];
  totalPurchase: number;
  totalSale: number;
  totalProfit: number;
  soldCount: number;
}

const groupPurchases = (list: SteamItemPurchase[]): PurchaseGroup[] => {
  const map = new Map<number, PurchaseGroup>();
  for (const p of list) {
    if (!map.has(p.steamItemId)) {
      map.set(p.steamItemId, {
        steamItemId: p.steamItemId,
        itemName: p.itemName,
        itemImage: p.itemImage,
        itemGame: p.itemGame,
        items: [],
        totalPurchase: 0,
        totalSale: 0,
        totalProfit: 0,
        soldCount: 0,
      });
    }
    const g = map.get(p.steamItemId)!;
    g.items.push(p);
    g.totalPurchase += p.purchasePrice;
    g.totalSale += p.salePrice;
    if (p.profit != null) { g.totalProfit += p.profit; g.soldCount++; }
  }
  return Array.from(map.values());
};

export const PurchasePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SteamItemPurchase | null>(null);
  const [form, setForm] = useState<PurchaseFormValues>({ steamItemId: '', purchasePrice: '', salePrice: '0', quantity: '1' });
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const { data: steamItems } = useGetAllSteamItems();
  const { data: purchases, isLoading } = useGetAllSteamItemPurchases();
  const addMutation = useAddSteamItemPurchase();
  const updateMutation = useUpdateSteamItemPurchase();
  const deleteMutation = useDeleteSteamItemPurchase();

  const openAdd = () => {
    setEditing(null);
    setForm({ steamItemId: '', purchasePrice: '', salePrice: '0', quantity: '1' });
    setModalOpen(true);
  };

  const openEdit = (p: SteamItemPurchase) => {
    setEditing(p);
    setForm({ steamItemId: String(p.steamItemId), purchasePrice: String(p.purchasePrice), salePrice: String(p.salePrice), quantity: '1' });
    setModalOpen(true);
  };

  const handleItemSelect = (id: string) => {
    const item = steamItems?.find((i) => i.id === Number(id));
    setForm((f) => ({ ...f, steamItemId: id, purchasePrice: item?.price ? String(item.price) : '' }));
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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

  const dota = groupPurchases(purchases?.filter((p) => p.itemGame === 1) ?? []);
  const cs2 = groupPurchases(purchases?.filter((p) => p.itemGame === 2) ?? []);
  const totalGlobal = (purchases ?? []).reduce((acc, p) => acc + (p.profit ?? 0), 0);

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
                          ? (isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />)
                          : <span className="w-3.5" />
                        }
                        <span className="truncate max-w-[220px] font-medium">{g.itemName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <img src={g.itemImage} alt={g.itemName} className="w-36 h-36 object-contain mx-auto" />
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compras Steam</h1>
        <div className="flex items-center gap-3">
          {totalGlobal !== 0 && (
            <span className={`text-sm font-semibold ${totalGlobal >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              Total: S/. {totalGlobal.toFixed(2)}
            </span>
          )}
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" /> Registrar compra
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : !purchases?.length ? (
        <p className="text-sm text-muted-foreground">No hay compras registradas.</p>
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
            <div className="grid grid-cols-5 gap-2 max-h-[420px] overflow-y-auto">
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
