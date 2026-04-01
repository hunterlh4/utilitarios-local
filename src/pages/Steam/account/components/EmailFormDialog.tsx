import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { useAddEmail } from '../hooks/useAddEmail.hook';
import { useUpdateEmail } from '../hooks/useUpdateEmail.hook';
import { useGetEmails } from '../hooks/useGetEmails.hook';
import type { AccountEmail } from '../models/account.model';

interface Props {
  item?: AccountEmail;
  onClose: () => void;
}

export const EmailFormDialog = ({ item, onClose }: Props) => {
  const isEdit = !!item;
  const addMutation = useAddEmail();
  const updateMutation = useUpdateEmail();
  const { data: emails } = useGetEmails();

  const [form, setForm] = useState({
    provider: 'gmail',
    email: '',
    password: '',
    phone: '',
    recoveryEmailId: '',
  });

  useEffect(() => {
    if (item) setForm({
      provider: item.provider,
      email: item.email,
      password: item.password,
      phone: item.phone ?? '',
      recoveryEmailId: item.recoveryEmailId ? String(item.recoveryEmailId) : '',
    });
  }, [item]);

  const f = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const payload = {
      provider: form.provider,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
      recoveryEmailId: form.recoveryEmailId ? Number(form.recoveryEmailId) : undefined,
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
        <DialogHeader><DialogTitle>{isEdit ? 'Editar email' : 'Agregar email'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Proveedor</Label>
            <Select value={form.provider} onValueChange={(v) => f('provider', v)}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Correo</Label>
            <Input value={form.email} onChange={(e) => f('email', e.target.value)} placeholder="juan@gmail.com" />
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
            <Label>Recovery email</Label>
            <Select value={form.recoveryEmailId} onValueChange={(v) => f('recoveryEmailId', v)}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Ninguno" /></SelectTrigger>
              <SelectContent>
                {emails?.filter((e) => e.id !== item?.id).map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>{e.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!form.email || !form.password || addMutation.isPending || updateMutation.isPending}>
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
