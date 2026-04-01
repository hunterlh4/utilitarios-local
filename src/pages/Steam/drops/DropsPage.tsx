import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { getQualityByName } from '../shared/item-quality';
import { useGetAllSteamItems } from '../search/hooks/useGetAllSteamItems.hook';
import { useGetAllSteamItemDrops } from './hooks/useGetAllSteamItemDrops.hook';
import { useAddSteamItemDrop } from './hooks/useAddSteamItemDrop.hook';
import { useUpdateSteamItemDrop } from './hooks/useUpdateSteamItemDrop.hook';
import { useDeleteSteamItemDrop } from './hooks/useDeleteSteamItemDrop.hook';
import type { SteamItemDrop } from './models/steam-item-drop.model';

const STEAM_FEE = 0.87; // Steam cobra ~13%, el vendedor recibe 87%

interface DropFormValues {
  steamItemId: string;
  quantity: string;
  price: string;
  salePrice: string;
}

export const DropsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SteamItemDrop | null>(null);
  const [form, setForm] = useState<DropFormValues>({ steamItemId: '', quantity: '1', price: '', salePrice: '' });

  const { data: steamItems } = useGetAllSteamItems();
  const { data: drops, isLoading } = useGetAllSteamItemDrops();
  const addMutation = useAddSteamItemDrop();
  const updateMutation = useUpdateSteamItemDrop();
  const deleteMutation = useDeleteSteamItemDrop();

  const openAdd = () => {
    setEditing(null);
    setForm({ steamItemId: '', quantity: '1', price: '', salePrice: '' });
    setModalOpen(true);
  };

  const openEdit = (drop: SteamItemDrop) => {
    setEditing(drop);
    setForm({
      steamItemId: String(drop.steamItemId),
      quantity: String(drop.quantity),
      price: String(drop.price),
      salePrice: String(drop.salePrice),
    });
    setModalOpen(true);
  };

  // Al seleccionar un item, carga su precio y calcula el precio de venta
  const handleItemSelect = (id: string) => {
    const item = steamItems?.find((i) => i.id === Number(id));
    if (item?.price) {
      const salePrice = parseFloat((item.price * STEAM_FEE).toFixed(2));
      setForm((f) => ({ ...f, steamItemId: id, price: String(item.price), salePrice: String(salePrice) }));
    } else {
      setForm((f) => ({ ...f, steamItemId: id, price: '', salePrice: '' }));
    }
  };

  const calcTotal = () => {
    const qty = parseFloat(form.quantity) || 0;
    const sale = parseFloat(form.salePrice) || 0;
    return parseFloat((qty * sale).toFixed(2));
  };

  const handleSubmit = () => {
    const payload = {
      steamItemId: Number(form.steamItemId),
      quantity: Number(form.quantity),
      price: parseFloat(form.price),
      salePrice: parseFloat(form.salePrice),
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, {
        onSuccess: () => { toast.success('Drop actualizado'); setModalOpen(false); },
        onError: () => toast.error('Error al actualizar'),
      });
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => { toast.success('Drop agregado'); setModalOpen(false); },
        onError: () => toast.error('Error al agregar'),
      });
    }
  };

  const totalGanancia = drops?.reduce((acc, d) => acc + d.total, 0) ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Drops Steam</h1>
        <Button size="sm"  onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Agregar drop
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : !drops?.length ? (
        <p className="text-sm text-muted-foreground">No hay drops registrados.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium">Item</th>
                <th className="text-center px-4 py-3 font-medium w-36">Foto</th>
                <th className="text-center px-4 py-3 font-medium">Cant.</th>
                <th className="text-center px-4 py-3 font-medium">Precio</th>
                <th className="text-center px-4 py-3 font-medium">Venta</th>
                <th className="text-center px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {drops.map((drop) => {
                return (
                  <tr
                    key={drop.id}
                    className="hover:bg-muted/30 cursor-pointer transition-colors group"
                    onClick={() => openEdit(drop)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="truncate max-w-[220px] font-medium">{drop.itemName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <img src={drop.itemImage} alt={drop.itemName} className="w-36 h-36 object-contain mx-auto" />
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{drop.quantity}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">S/. {drop.price}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">S/. {drop.salePrice}</td>
                    <td className="px-4 py-3 text-center font-semibold">S/. {drop.total}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="icon" variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(drop.id, { onSuccess: () => toast.success('Eliminado') }); }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-muted/40 border-t">
                <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total ganancia</td>
                <td className="px-4 py-3 text-right font-bold text-base">S/. {totalGanancia.toFixed(2)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar drop' : 'Agregar drop'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Grid de items */}
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
                    <img src={item.image} alt={item.name} className="w-full h-28 object-contain p-1" />
                  </div>
                );
              })}
            </div>

            {form.steamItemId && (
              <p className="text-xs text-muted-foreground">
                {steamItems?.find((i) => String(i.id) === form.steamItemId)?.name}
              </p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Cantidad</Label>
                <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
              </div>
              <div>
                <Label>Precio (S/.)</Label>
                <Input
                  type="number" step="0.01" value={form.price}
                  onChange={(e) => {
                    const price = e.target.value;
                    const salePrice = price ? parseFloat((parseFloat(price) * STEAM_FEE).toFixed(2)) : '';
                    setForm((f) => ({ ...f, price, salePrice: String(salePrice) }));
                  }}
                />
              </div>
              <div>
                <Label>Precio venta (S/.)</Label>
                <Input
                  type="number" step="0.01" value={form.salePrice}
                  onChange={(e) => {
                    const salePrice = e.target.value;
                    const price = salePrice ? parseFloat((parseFloat(salePrice) / STEAM_FEE).toFixed(2)) : '';
                    setForm((f) => ({ ...f, salePrice, price: String(price) }));
                  }}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Total: <span className="font-semibold text-foreground">S/. {calcTotal()}</span>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.steamItemId || addMutation.isPending || updateMutation.isPending}
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
