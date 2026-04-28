import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { useAddSteam } from '../hooks/useAddSteam.hook';
import { useUpdateSteam } from '../hooks/useUpdateSteam.hook';
import { useGetEmails } from '../hooks/useGetEmails.hook';
import type { AccountSteam } from '../models/account.model';
import { SearchableSelect } from './SearchableSelect';

const toDateValue = (value?: string | null) => {
  if (!value) return '';
  return value.split('T')[0]; // Extrae solo la fecha YYYY-MM-DD
};

const toIsoDate = (value: string) => {
  if (!value) return undefined;
  // Asegura que la fecha se envíe como YYYY-MM-DDT00:00:00.000Z
  return new Date(value + 'T00:00:00.000Z').toISOString();
};

interface Props {
  item?: AccountSteam;
  onClose: () => void;
}

export const SteamFormDialog = ({ item, onClose }: Props) => {
  const isEdit = !!item;
  const addMutation = useAddSteam();
  const updateMutation = useUpdateSteam();
  const { data: emails } = useGetEmails();

  const [form, setForm] = useState({
    emailId: '',
    username: '',
    password: '',
    phone: '',
    profileUrl: '',
    imageUrl: '',
    hasDota2: false,
    hasCS2: false,
    isUnlimited: false,
    isVacBanned: false,
    hasSteamMobile: false,
    lastPurchaseDate: '',
  });

  useEffect(() => {
    if (item) setForm({
      emailId: item.emailId ? String(item.emailId) : '',
      username: item.username,
      password: item.password,
      phone: item.phone ?? '',
      profileUrl: item.profileUrl ?? '',
      imageUrl: item.imageUrl ?? '',
      hasDota2: item.hasDota2,
      hasCS2: item.hasCS2,
      isUnlimited: item.isUnlimited,
      isVacBanned: item.isVacBanned,
      hasSteamMobile: item.hasSteamMobile,
      lastPurchaseDate: toDateValue(item.lastPurchaseDate),
    });
  }, [item]);

  const f = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const lastPurchaseDateValue = form.lastPurchaseDate ? toIsoDate(form.lastPurchaseDate) : undefined;
    
    const payload = {
      emailId: form.emailId ? Number(form.emailId) : undefined,
      username: form.username,
      password: form.password,
      phone: form.phone || undefined,
      profileUrl: form.profileUrl || undefined,
      imageUrl: form.imageUrl || undefined,
      hasDota2: form.hasDota2,
      hasCS2: form.hasCS2,
      isUnlimited: form.isUnlimited,
      isVacBanned: form.isVacBanned,
      hasSteamMobile: form.hasSteamMobile,
      lastPurchaseDate: lastPurchaseDateValue,
    };

    if (isEdit) {
      updateMutation.mutate({ id: item.id, data: payload }, {
        onSuccess: () => { toast.success('Actualizado'); onClose(); },
        onError: () => toast.error('Error al actualizar'),
      });
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => { toast.success('Creado'); onClose(); },
        onError: () => toast.error('Error al crear'),
      });
    }
  };

  const check = (label: string, key: string) => (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={!!(form as any)[key]} onChange={(e) => f(key, e.target.checked)} className="w-4 h-4" />
      {label}
    </label>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isEdit ? 'Editar Steam' : 'Agregar Steam'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Correo asociado</Label>
            <SearchableSelect
              value={form.emailId}
              onValueChange={(v) => f('emailId', v)}
              placeholder="Seleccionar correo..."
              searchPlaceholder="Buscar correo..."
              emptyText="No hay correos que coincidan"
              options={(emails ?? []).map((e) => ({ value: String(e.id), label: e.email }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Usuario Steam</Label>
            <Input value={form.username} onChange={(e) => f('username', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Contraseña</Label>
            <Input value={form.password} onChange={(e) => f('password', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Celular</Label>
            <Input value={form.phone} onChange={(e) => f('phone', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>URL de perfil</Label>
            <Input value={form.profileUrl} onChange={(e) => f('profileUrl', e.target.value)} placeholder="https://steamcommunity.com/id/..." />
          </div>
          <div className="space-y-1">
            <Label>URL de imagen</Label>
            <Input value={form.imageUrl} onChange={(e) => f('imageUrl', e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>Última compra (fecha)</Label>
            <Input 
              type="date" 
              value={form.lastPurchaseDate} 
              onChange={(e) => f('lastPurchaseDate', e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {check('Dota 2', 'hasDota2')}
            {check('CS2', 'hasCS2')}
            {check('Ilimitada', 'isUnlimited')}
            {check('VAC Banned', 'isVacBanned')}
            {check('Steam Mobile', 'hasSteamMobile')}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!form.username || !form.password || addMutation.isPending || updateMutation.isPending}>
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
