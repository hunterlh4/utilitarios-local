import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetGitHubs } from '../hooks/useGetGitHubs.hook';
import { useDeleteGitHub } from '../hooks/useDeleteGitHub.hook';
import { AccountCard } from './AccountCard';
import { GitHubFormDialog } from './GitHubFormDialog';
import { FilterChip } from './FilterChip';
import type { AccountGitHub } from '../models/account.model';

export const GitHubTab = ({ search = '' }: { search?: string }) => {
  const { data, isLoading } = useGetGitHubs();
  const deleteMutation = useDeleteGitHub();
  const [modal, setModal] = useState<{ item?: AccountGitHub } | null>(null);
  const [filters, setFilters] = useState({ withEmail: true, withoutEmail: true });

  const toggle = (key: keyof typeof filters) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const filtered = data?.filter((g) => {
    const matchSearch = g.username.toLowerCase().includes(search.toLowerCase()) ||
      (g.emailAddress ?? '').toLowerCase().includes(search.toLowerCase());
    const allActive = Object.values(filters).every(Boolean);
    if (allActive) return matchSearch;
    const matchFilter = (filters.withEmail && !!g.emailId) || (filters.withoutEmail && !g.emailId);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-3 pt-4">
      <div className="flex gap-2 flex-wrap">
        <FilterChip label="Con correo" icon="/svg/gmail.svg" active={filters.withEmail} onChange={() => toggle('withEmail')} />
        <FilterChip label="Sin correo" active={filters.withoutEmail} onChange={() => toggle('withoutEmail')} />
      </div>
      {isLoading ? <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div> : (
        <div className="grid grid-cols-3 gap-3">
          {filtered?.map((g) => (
            <AccountCard
              key={g.id}
              title={g.username}
              icon="/svg/google.svg"
              password={g.password}
              profileUrl={g.profileUrl}
              fields={[{ label: 'Correo', value: g.emailAddress }]}
              onEdit={() => setModal({ item: g })}
              onDelete={() => deleteMutation.mutate(g.id, { onSuccess: () => toast.success('Eliminado') })}
            />
          ))}
        </div>
      )}
      {modal && <GitHubFormDialog item={modal.item} onClose={() => setModal(null)} />}
    </div>
  );
};
