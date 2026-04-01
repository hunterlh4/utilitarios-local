import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { useAddEmail } from '../hooks/useAddEmail.hook';
import { useUpdateEmail } from '../hooks/useUpdateEmail.hook';
import { useAddSteam } from '../hooks/useAddSteam.hook';
import { useUpdateSteam } from '../hooks/useUpdateSteam.hook';
import { useAddGitHub } from '../hooks/useAddGitHub.hook';
import { useUpdateGitHub } from '../hooks/useUpdateGitHub.hook';
import { useAddGeneral } from '../hooks/useAddGeneral.hook';
import { useUpdateGeneral } from '../hooks/useUpdateGeneral.hook';
import { useAddKiro } from '../hooks/useAddKiro.hook';
import { useUpdateKiro } from '../hooks/useUpdateKiro.hook';
import { useGetEmails } from '../hooks/useGetEmails.hook';
import { useGetGitHubs } from '../hooks/useGetGitHubs.hook';
import { GeneralPlatform, GeneralPlatformLabels, LinkedAccountType } from '../models/account.model';

interface Props {
  type: string;
  item?: any;
  onClose: () => void;
}

export const AccountModal = ({ type, item, onClose }: Props) => {
  const isEdit = !!item;
  const [form, setForm] = useState<Record<string, any>>({});

  const createEmail = useAddEmail(); const updateEmail = useUpdateEmail();
  const createSteam = useAddSteam(); const updateSteam = useUpdateSteam();
  const createGitHub = useAddGitHub(); const updateGitHub = useUpdateGitHub();
  const createGeneral = useAddGeneral(); const updateGeneral = useUpdateGeneral();
  const createKiro = useAddKiro(); const updateKiro = useUpdateKiro();
  const { data: emails } = useGetEmails();
  const { data: gitHubs } = useGetGitHubs();

  useEffect(() => {
    if (item) setForm({ ...item });
    else {
      const defaults: Record<string, any> = {
        email: { isNew: true, provider: 'gmail' },
        steam: { isNew: true, hasDota2: false, hasCS2: false, isUnlimited: false, isVacBanned: false },
        github: { isNew: true },
        general: { platform: GeneralPlatform.Facebook },
        kiro: { isNew: true, linkedType: LinkedAccountType.Email },
      };
      setForm(defaults[type] ?? {});
    }
  }, [item, type]);

  const f = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = () => {
    const payload = { ...form };
    if (!payload.isNew) payload.lastUsed = payload.lastUsed || new Date().toISOString();

    const ops: Record<string, () => void> = {
      email: () => isEdit ? updateEmail.mutate({ id: item.id, data: payload as any }) : createEmail.mutate(payload as any),
      steam: () => isEdit ? updateSteam.mutate({ id: item.id, data: payload as any }) : createSteam.mutate(payload as any),
      github: () => isEdit ? updateGitHub.mutate({ id: item.id, data: payload as any }) : createGitHub.mutate(payload as any),
      general: () => isEdit ? updateGeneral.mutate({ id: item.id, data: payload as any }) : createGeneral.mutate(payload as any),
      kiro: () => isEdit ? updateKiro.mutate({ id: item.id, data: payload as any }) : createKiro.mutate(payload as any),
    };
    ops[type]?.();
    toast.success(isEdit ? 'Actualizado' : 'Creado');
    onClose();
  };

  const field = (label: string, key: string, placeholder?: string, inputType = 'text') => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type={inputType} placeholder={placeholder} value={form[key] ?? ''} onChange={(e) => f(key, e.target.value)} />
    </div>
  );

  const check = (label: string, key: string) => (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={!!form[key]} onChange={(e) => f(key, e.target.checked)} className="w-4 h-4" />
      {label}
    </label>
  );

  const isNewToggle = (
    <div className="space-y-1">
      <Label>Estado</Label>
      <Select value={form.isNew ? 'new' : 'used'} onValueChange={(v) => f('isNew', v === 'new')}>
        <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Nueva</SelectItem>
          <SelectItem value="used">Reutilizada</SelectItem>
        </SelectContent>
      </Select>
      {!form.isNew && (
        <div className="space-y-1 pt-1">
          <Label>Último uso</Label>
          <Input type="date" value={form.lastUsed ? form.lastUsed.split('T')[0] : ''} onChange={(e) => f('lastUsed', e.target.value)} />
        </div>
      )}
    </div>
  );

  const emailSelect = (key = 'emailId') => (
    <div className="space-y-1">
      <Label>Correo asociado</Label>
      <Select value={String(form[key] ?? '')} onValueChange={(v) => f(key, Number(v))}>
        <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Seleccionar correo..." /></SelectTrigger>
        <SelectContent>
          {(emails ?? []).map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.email}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const titles: Record<string, string> = {
    email: 'Email', steam: 'Steam', github: 'GitHub', general: 'General', kiro: 'Kiro',
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isEdit ? 'Editar' : 'Agregar'} {titles[type]}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {type === 'email' && (<>
            <div className="space-y-1">
              <Label>Proveedor</Label>
              <Select value={form.provider ?? 'gmail'} onValueChange={(v) => f('provider', v)}>
                <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {field('Correo', 'email', 'juan@gmail.com')}
            {field('Contraseña', 'password')}
            {field('Celular', 'phone')}
            {field('Recovery email', 'recoveryEmail')}
            {isNewToggle}
          </>)}

          {type === 'steam' && (<>
            {emailSelect()}
            {field('Usuario Steam', 'username', 'juangamer')}
            {field('Contraseña', 'password')}
            {field('Celular', 'phone')}
            {field('URL de perfil', 'profileUrl', 'https://steamcommunity.com/id/...')}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {check('Dota 2', 'hasDota2')}
              {check('CS2', 'hasCS2')}
              {check('Ilimitada', 'isUnlimited')}
              {check('VAC Banned', 'isVacBanned')}
            </div>
            {isNewToggle}
          </>)}

          {type === 'github' && (<>
            {emailSelect()}
            {field('Usuario GitHub', 'username')}
            {field('Contraseña', 'password')}
            {field('URL de perfil', 'profileUrl', 'https://github.com/...')}
            {isNewToggle}
          </>)}

          {type === 'general' && (<>
            <div className="space-y-1">
              <Label>Plataforma</Label>
              <Select value={String(form.platform ?? GeneralPlatform.Facebook)} onValueChange={(v) => f('platform', Number(v))}>
                <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(GeneralPlatform).filter((v) => typeof v === 'number').map((p) => (
                    <SelectItem key={p} value={String(p)}>{GeneralPlatformLabels[p as GeneralPlatform]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {field('Usuario', 'username')}
            {field('Contraseña', 'password')}
            {emailSelect()}
            {field('URL de perfil', 'profileUrl')}
          </>)}

          {type === 'kiro' && (<>
            <div className="space-y-1">
              <Label>Tipo de cuenta vinculada</Label>
              <Select value={String(form.linkedType ?? LinkedAccountType.Email)} onValueChange={(v) => f('linkedType', Number(v))}>
                <SelectTrigger className="focus-visible:ring-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(LinkedAccountType.Email)}>Email</SelectItem>
                  <SelectItem value={String(LinkedAccountType.GitHub)}>GitHub</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.linkedType === LinkedAccountType.Email || !form.linkedType ? (
              <div className="space-y-1">
                <Label>Correo</Label>
                <Select value={String(form.refId ?? '')} onValueChange={(v) => f('refId', Number(v))}>
                  <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    {(emails ?? []).map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1">
                <Label>GitHub</Label>
                <Select value={String(form.refId ?? '')} onValueChange={(v) => f('refId', Number(v))}>
                  <SelectTrigger className="focus-visible:ring-0"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>
                    {(gitHubs ?? []).map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.username}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {isNewToggle}
          </>)}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
