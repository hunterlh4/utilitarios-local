import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { useAddKiro } from '../hooks/useAddKiro.hook';
import { useUpdateKiro } from '../hooks/useUpdateKiro.hook';
import { useGetEmails } from '../hooks/useGetEmails.hook';
import { useGetGitHubs } from '../hooks/useGetGitHubs.hook';
import { LinkedAccountType } from '../models/account.model';
import type { AccountKiro } from '../models/account.model';

interface Props {
  item?: AccountKiro | null;
  onClose: () => void;
}

export const KiroFormDialog = ({ item, onClose }: Props) => {
  const isEdit = !!item;
  const addMutation = useAddKiro();
  const updateMutation = useUpdateKiro();
  const { data: emails } = useGetEmails();
  const { data: gitHubs } = useGetGitHubs();

  const [form, setForm] = useState({
    linkedType: String(LinkedAccountType.Email),
    refId: '',
    isNew: true,
    lastUsed: '',
  });

  useEffect(() => {
    if (item) setForm({
      linkedType: String(item.linkedType),
      refId: String(item.refId),
      isNew: item.isNew,
      lastUsed: item.lastUsed ? item.lastUsed.split('T')[0] : '',
    });
  }, [item]);

  const f = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const payload = {
      linkedType: Number(form.linkedType) as LinkedAccountType,
      refId: Number(form.refId),
      isNew: form.isNew,
      lastUsed: form.isNew ? undefined : (form.lastUsed || undefined),
    };
    if (isEdit) {
      updateMutation.mutate({ id: item!.id, data: payload }, {
        onSuccess: () => { toast.success('Actualizado'); onClose(); },
        onError: () => toast.error('Error al actualizar'),
      });
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => { toast.success('Configurado'); onClose(); },
        onError: () => toast.error('Error al configurar'),
      });
    }
  };

  const linkedType = Number(form.linkedType) as LinkedAccountType;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isEdit ? 'Editar Kiro' : 'Configurar Kiro'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Tipo de cuenta vinculada</Label>
            <Select value={form.linkedType} onValueChange={(v) => { f('linkedType', v); f('refId', ''); }}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={String(LinkedAccountType.Email)}>Email</SelectItem>
                <SelectItem value={String(LinkedAccountType.GitHub)}>GitHub</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>{linkedType === LinkedAccountType.Email ? 'Correo' : 'GitHub'}</Label>
            <Select value={form.refId} onValueChange={(v) => f('refId', v)}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
              <SelectContent>
                {linkedType === LinkedAccountType.Email
                  ? emails?.map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.email}</SelectItem>)
                  : gitHubs?.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.username}</SelectItem>)
                }
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Estado</Label>
            <Select value={form.isNew ? 'new' : 'used'} onValueChange={(v) => f('isNew', v === 'new')}>
              <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nueva</SelectItem>
                <SelectItem value="used">Reutilizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!form.isNew && (
            <div className="space-y-1">
              <Label>Último uso</Label>
              <Input type="date" value={form.lastUsed} onChange={(e) => f('lastUsed', e.target.value)} />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!form.refId || addMutation.isPending || updateMutation.isPending}>
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
