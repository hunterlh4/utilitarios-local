import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, RefreshCw } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetKiro } from '../hooks/useGetKiro.hook';
import { useUseKiro } from '../hooks/useUseKiro.hook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/account.service';
import { KiroFormDialog } from './KiroFormDialog';
import { AccountCard } from './AccountCard';
import { FilterChip } from './FilterChip';
import { LinkedAccountType } from '../models/account.model';

export const KiroTab = ({ search = '' }: { search?: string }) => {
  const { data: kiro, isLoading } = useGetKiro();
  const useKiroMutation = useUseKiro();
  const [editOpen, setEditOpen] = useState(false);
  const [filters, setFilters] = useState({ email: true, github: true });
  const qc = useQueryClient();

  const toggle = (key: keyof typeof filters) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const resetMutation = useMutation({
    mutationFn: () => accountService.resetKiro(),
    onSuccess: (count: number) => {
      toast.success(`${count} cuenta${count !== 1 ? 's' : ''} reseteada${count !== 1 ? 's' : ''}`);
      qc.invalidateQueries({ queryKey: ['accounts-kiro'] });
    },
    onError: () => toast.error('Error al resetear'),
  });

  const visible = kiro && (
    (kiro.linkedType === LinkedAccountType.Email && filters.email) ||
    (kiro.linkedType === LinkedAccountType.GitHub && filters.github)
  ) && (kiro.linkedDisplay.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <FilterChip label="Gmail" icon="/svg/gmail.svg" active={filters.email} onChange={() => toggle('email')} />
          <FilterChip label="GitHub" icon="/svg/github.svg" active={filters.github} onChange={() => toggle('github')} />
        </div>
        {kiro && (
          <Button size="sm" variant="outline" onClick={() => resetMutation.mutate()} disabled={resetMutation.isPending}>
            <RotateCcw className="w-4 h-4 mr-1" />
            {resetMutation.isPending ? 'Reseteando...' : 'Reset mensual'}
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : !kiro ? (
        <p className="text-sm text-muted-foreground">No hay cuenta Kiro configurada. Usa el botón Nuevo para configurarla.</p>
      ) : visible ? (
        <AccountCard
          title={kiro.linkedDisplay}
          icon={kiro.linkedType === LinkedAccountType.Email ? '/svg/gmail.svg' : '/svg/google.svg'}
          password=""
          fields={[
            { label: 'Tipo', value: kiro.linkedType === LinkedAccountType.Email ? 'Email' : 'GitHub' },
            { label: 'Último uso', value: kiro.lastUsed ? new Date(kiro.lastUsed).toLocaleDateString('es-PE') : 'Nunca' },
          ]}
          badges={
            <span className={`text-xs px-1.5 py-0.5 rounded inline-block font-medium ${!kiro.lastUsed ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
              {!kiro.lastUsed ? 'Disponible' : 'No disponible'}
            </span>
          }
          extraActions={
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => useKiroMutation.mutate(kiro.id, { onSuccess: () => toast.success('Uso registrado') })}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          }
          onEdit={() => setEditOpen(true)}
          onDelete={() => {}}
          hideDelete
        />
      ) : null}
      {editOpen && <KiroFormDialog item={kiro} onClose={() => setEditOpen(false)} />}
    </div>
  );
};
