import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Eye, EyeOff, ExternalLink, RefreshCw, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Badge } from '@/common/components/ui/badge';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { useGetAllAccounts } from './hooks/useGetAllAccounts.hook';
import { useAddAccount } from './hooks/useAddAccount.hook';
import { useUpdateAccount } from './hooks/useUpdateAccount.hook';
import { useDeleteAccount } from './hooks/useDeleteAccount.hook';
import { useUseAccount } from './hooks/useUseAccount.hook';
import { AccountType, AccountTypeLabels, AccountTypeColors } from './enums/account.enum';
import type { Account } from './models/account.model';
import type { CreateAccountDto } from './models/account-request.dto';

// Calcula si la cuenta necesita renovarse este mes
const needsRenewal = (lastConnection: string | undefined, renewalDay: number): boolean => {
  const today = new Date();
  if (!lastConnection) return today.getDate() >= renewalDay;
  const last = new Date(lastConnection);
  const sameMonth = last.getMonth() === today.getMonth() && last.getFullYear() === today.getFullYear();
  if (sameMonth) return false;
  return today.getDate() >= renewalDay;
};

interface FormValues {
  type: string;
  name: string;
  username: string;
  password: string;
  profileUrl: string;
  phoneNumber: string;
  recoveryEmail: string;
  renewalDay: string;
  properties: { key: string; value: string }[];
}

const emptyForm = (): FormValues => ({
  type: String(AccountType.Email),
  name: '', username: '', password: '', profileUrl: '',
  phoneNumber: '', recoveryEmail: '', renewalDay: '',
  properties: [],
});

export const AccountPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm());
  const [showPasswords, setShowPasswords] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const { data: accounts, isLoading } = useGetAllAccounts();
  const addMutation = useAddAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();
  const useMutation2 = useUseAccount();

  const togglePassword = (id: number) =>
    setShowPasswords((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleExpand = (id: number) =>
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const openAdd = () => { setEditing(null); setForm(emptyForm()); setModalOpen(true); };

  const openEdit = (acc: Account) => {
    setEditing(acc);
    setForm({
      type: String(acc.type),
      name: acc.name,
      username: acc.username ?? '',
      password: acc.password ?? '',
      profileUrl: acc.profileUrl ?? '',
      phoneNumber: acc.phoneNumber ?? '',
      recoveryEmail: acc.recoveryEmail ?? '',
      renewalDay: acc.renewals?.[0] ? String(acc.renewals[0].day) : '',
      properties: acc.properties?.map((p) => ({ key: p.key, value: p.value })) ?? [],
    });
    setModalOpen(true);
  };

  const buildPayload = (): CreateAccountDto => {
    const type = Number(form.type) as AccountType;
    // Para Email: el nombre es el correo mismo
    const name = type === AccountType.Email ? (form.username || 'Email') : form.name;
    return {
      type,
      name,
      username: form.username || undefined,
      password: form.password || undefined,
      profileUrl: form.profileUrl || undefined,
      phoneNumber: form.phoneNumber || undefined,
      recoveryEmail: form.recoveryEmail || undefined,
      renewals: form.renewalDay ? [{ day: Number(form.renewalDay) }] : [],
      properties: form.properties.filter((p) => p.key && p.value),
    };
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, {
        onSuccess: () => { toast.success('Cuenta actualizada'); setModalOpen(false); },
        onError: () => toast.error('Error al actualizar'),
      });
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => { toast.success('Cuenta creada'); setModalOpen(false); },
        onError: () => toast.error('Error al crear'),
      });
    }
  };

  const handleUse = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    useMutation2.mutate(id, { onSuccess: () => toast.success('Conexión registrada') });
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Cuenta eliminada'),
      onError: () => toast.error('Error al eliminar'),
    });
  };

  const renderAccount = (acc: Account) => {
    const showPw = showPasswords.has(acc.id);
    const renewal = acc.renewals?.[0];
    const overdue = renewal ? needsRenewal(acc.lastConnection, renewal.day) : false;

    return (
      <div key={acc.id} className="rounded-xl border overflow-hidden">
        <div
          className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/20 transition-colors group"
          onClick={() => openEdit(acc)}
        >
          {/* Tipo */}
          <Badge className={`text-xs flex-shrink-0 mt-0.5 ${AccountTypeColors[acc.type]}`}>
            {AccountTypeLabels[acc.type]}
          </Badge>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{acc.name}</span>
              {renewal && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${overdue ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                  {overdue ? `Renovar (día ${renewal.day})` : `Renovado ✓`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-sm">
              {acc.username && (
                <div className="flex gap-1.5">
                  <span className="text-muted-foreground text-xs">Usuario</span>
                  <span className="font-mono text-xs truncate">{acc.username}</span>
                </div>
              )}
              {acc.password && (
                <div className="flex gap-1.5 items-center">
                  <span className="text-muted-foreground text-xs">Pass</span>
                  <span className="font-mono text-xs">{showPw ? acc.password : '••••••••'}</span>
                  <button onClick={(e) => { e.stopPropagation(); togglePassword(acc.id); }} className="text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              )}
              {acc.recoveryEmail && (
                <div className="flex gap-1.5">
                  <span className="text-muted-foreground text-xs">Recovery</span>
                  <span className="text-xs truncate">{acc.recoveryEmail}</span>
                </div>
              )}
              {acc.phoneNumber && (
                <div className="flex gap-1.5">
                  <span className="text-muted-foreground text-xs">Tel</span>
                  <span className="text-xs">{acc.phoneNumber}</span>
                </div>
              )}
              {acc.lastConnection && (
                <div className="flex gap-1.5">
                  <span className="text-muted-foreground text-xs">Último uso</span>
                  <span className="text-xs">{new Date(acc.lastConnection).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {acc.properties && acc.properties.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {acc.properties.map((p) => (
                  <span key={p.id} className={`text-xs px-1.5 py-0.5 rounded ${p.value === 'true' || p.value === '1' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {p.key}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {acc.profileUrl && (
              <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                <a href={acc.profileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => handleUse(acc.id, e)}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEdit(acc); }}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => handleDelete(acc.id, e)} disabled={deleteMutation.isPending}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Agrupar por tipo
  const grouped = Object.values(AccountType)
    .filter((v) => typeof v === 'number')
    .map((type) => ({
      type: type as AccountType,
      items: accounts?.filter((a) => a.type === type) ?? [],
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cuentas</h1>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Nueva cuenta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : !accounts?.length ? (
        <p className="text-sm text-muted-foreground">No hay cuentas registradas.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ type, items }) => (
            <div key={type} className="space-y-2">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleExpand(type)}
              >
                {expanded.has(type) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <h2 className="text-base font-semibold">{AccountTypeLabels[type]}</h2>
                <span className="text-xs text-muted-foreground">({items.length})</span>
              </div>
              {expanded.has(type) && (
                <div className="space-y-2 pl-4">
                  {items.map((acc) => renderAccount(acc))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar cuenta' : 'Nueva cuenta'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AccountType).filter((v) => typeof v === 'number').map((t) => (
                    <SelectItem key={t} value={String(t)}>{AccountTypeLabels[t as AccountType]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email: correo, contraseña, recovery, teléfono */}
            {Number(form.type) === AccountType.Email && (<>
              <div className="space-y-1">
                <Label>Correo</Label>
                <Input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="juan@gmail.com" />
              </div>
              <div className="space-y-1">
                <Label>Contraseña</Label>
                <Input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Recovery email</Label>
                  <Input value={form.recoveryEmail} onChange={(e) => setForm((f) => ({ ...f, recoveryEmail: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Teléfono</Label>
                  <Input value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))} />
                </div>
              </div>
            </>)}

            {/* Steam: correo, usuario steam, contraseña, teléfono */}
            {Number(form.type) === AccountType.Steam && (<>
              <div className="space-y-1">
                <Label>Correo asociado</Label>
                <Input value={form.recoveryEmail} onChange={(e) => setForm((f) => ({ ...f, recoveryEmail: e.target.value }))} placeholder="juan@gmail.com" />
              </div>
              <div className="space-y-1">
                <Label>Usuario Steam</Label>
                <Input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="juangamer" />
              </div>
              <div className="space-y-1">
                <Label>Contraseña</Label>
                <Input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Teléfono</Label>
                <Input value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>URL de perfil</Label>
                <Input value={form.profileUrl} onChange={(e) => setForm((f) => ({ ...f, profileUrl: e.target.value }))} placeholder="https://steamcommunity.com/id/..." />
              </div>
            </>)}

            {/* Otros: nombre, usuario, contraseña, URL */}
            {![AccountType.Email, AccountType.Steam].includes(Number(form.type) as AccountType) && (<>
              <div className="space-y-1">
                <Label>Nombre / Alias</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Main, Personal..." />
              </div>
              <div className="space-y-1">
                <Label>Usuario</Label>
                <Input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Contraseña</Label>
                <Input value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>URL de perfil</Label>
                <Input value={form.profileUrl} onChange={(e) => setForm((f) => ({ ...f, profileUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </>)}

            {Number(form.type) === AccountType.Kiro && (
              <div className="space-y-1">
                <Label>Día de renovación (1-31)</Label>
                <Input type="number" min="1" max="31" value={form.renewalDay} onChange={(e) => setForm((f) => ({ ...f, renewalDay: e.target.value }))} placeholder="ej: 1" />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                {addMutation.isPending || updateMutation.isPending ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
