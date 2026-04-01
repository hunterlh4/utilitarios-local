import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { useAddGitHub } from '../hooks/useAddGitHub.hook';
import { useUpdateGitHub } from '../hooks/useUpdateGitHub.hook';
import { useGetEmails } from '../hooks/useGetEmails.hook';
import type { AccountGitHub } from '../models/account.model';

interface Props {
  item?: AccountGitHub;
  onClose: () => void;
}

export const GitHubFormDialog = ({ item, onClose }: Props) => {
  const isEdit = !!item;
  const addMutation = useAddGitHub();
  const updateMutation = useUpdateGitHub();
  const { data: emails } = useGetEmails();

  const [form, setForm] = useState({ emailId: '', username: '', password: '', profileUrl: '' });

  useEffect(() => {
    if (item) setForm({
      emailId: item.emailId ? String(item.emailId) : '',
      username: item.username,
      password: item.password,
      profileUrl: item.profileUrl ?? '',
    });
  }, [item]);

  const f = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const payload = {
      emailId: form.emailId ? Number(form.emailId) : undefined,
      username: form.username,
      password: form.password,
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
        <DialogHeader><DialogTitle>{isEdit ? 'Editar GitHub' : 'Agregar GitHub'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Correo asociado</Label>
            <Select value={form.emailId} onValueChange={(v) => f('emailId', v)}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
              <SelectContent>
                {emails?.map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.email}</SelectItem>)}
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
            <Label>URL de perfil</Label>
            <Input value={form.profileUrl} onChange={(e) => f('profileUrl', e.target.value)} placeholder="https://github.com/..." />
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
