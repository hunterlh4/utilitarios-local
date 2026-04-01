import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { useAddGeneral } from '../hooks/useAddGeneral.hook';
import { useUpdateGeneral } from '../hooks/useUpdateGeneral.hook';
import { useGetEmails } from '../hooks/useGetEmails.hook';
import { GeneralPlatform, GeneralPlatformLabels } from '../models/account.model';
import type { AccountGeneral } from '../models/account.model';

interface Props {
  item?: AccountGeneral;
  onClose: () => void;
}

export const GeneralFormDialog = ({ item, onClose }: Props) => {
  const isEdit = !!item;
  const addMutation = useAddGeneral();
  const updateMutation = useUpdateGeneral();
  const { data: emails } = useGetEmails();

  const [form, setForm] = useState({ platform: String(GeneralPlatform.Facebook), username: '', password: '', emailId: '', profileUrl: '' });

  useEffect(() => {
    if (item) setForm({
      platform: String(item.platform),
      username: item.username,
      password: item.password,
      emailId: item.emailId ? String(item.emailId) : '',
      profileUrl: item.profileUrl ?? '',
    });
  }, [item]);

  const f = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const payload = {
      platform: Number(form.platform) as GeneralPlatform,
      username: form.username,
      password: form.password,
      emailId: form.emailId ? Number(form.emailId) : undefined,
      profileUrl: form.profileUrl || undefined,
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isEdit ? 'Editar cuenta' : 'Agregar cuenta'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Plataforma</Label>
            <Select value={form.platform} onValueChange={(v) => f('platform', v)}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(GeneralPlatform).filter((v) => typeof v === 'number').map((p) => (
                  <SelectItem key={p} value={String(p)}>{GeneralPlatformLabels[p as GeneralPlatform]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Usuario</Label>
            <Input value={form.username} onChange={(e) => f('username', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Contraseña</Label>
            <Input value={form.password} onChange={(e) => f('password', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Correo asociado (opcional)</Label>
            <Select value={form.emailId} onValueChange={(v) => f('emailId', v)}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Ninguno" /></SelectTrigger>
              <SelectContent>
                {emails?.map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>URL de perfil</Label>
            <Input value={form.profileUrl} onChange={(e) => f('profileUrl', e.target.value)} placeholder="https://..." />
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
