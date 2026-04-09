import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetGenerals } from '../hooks/useGetGenerals.hook';
import { useDeleteGeneral } from '../hooks/useDeleteGeneral.hook';
import { AccountCard } from './AccountCard';
import { GeneralFormDialog } from './GeneralFormDialog';
import { FilterChip } from './FilterChip';
import { GeneralPlatform, GeneralPlatformLabels } from '../models/account.model';
import type { AccountGeneral } from '../models/account.model';

const platformIcons: Partial<Record<GeneralPlatform, string>> = {
  [GeneralPlatform.Facebook]: '/svg/facebook.svg',
};

export const GeneralTab = ({ search = '', isActive = true }: { search?: string; isActive?: boolean }) => {
  const { data, isLoading } = useGetGenerals(isActive);
  const deleteMutation = useDeleteGeneral();
  const [modal, setModal] = useState<{ item?: AccountGeneral } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<GeneralPlatform>>(
    new Set(Object.values(GeneralPlatform).filter((v) => typeof v === 'number') as GeneralPlatform[])
  );

  const toggleFilter = (p: GeneralPlatform) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  const filtered = data?.filter((g) => {
    const matchSearch = g.username.toLowerCase().includes(search.toLowerCase()) ||
      GeneralPlatformLabels[g.platform].toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilters.size === 0 || activeFilters.has(g.platform);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-3 pt-4">
      <div className="flex gap-2 flex-wrap">
        {(Object.values(GeneralPlatform).filter((v) => typeof v === 'number') as GeneralPlatform[]).map((p) => (
          <FilterChip
            key={p}
            label={GeneralPlatformLabels[p]}
            icon={platformIcons[p]}
            active={activeFilters.has(p)}
            onChange={() => toggleFilter(p)}
          />
        ))}
      </div>
      {isLoading ? <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div> : (
        <div className="grid grid-cols-3 gap-3">
          {filtered?.map((g) => (
            <AccountCard
              key={g.id}
              title={`${GeneralPlatformLabels[g.platform]} — ${g.username}`}
              icon={platformIcons[g.platform]}
              password={g.password}
              profileUrl={g.profileUrl}
              fields={[{ label: 'Correo', value: g.emailAddress }]}
              onEdit={() => setModal({ item: g })}
              onDelete={() => deleteMutation.mutate(g.id, { onSuccess: () => toast.success('Eliminado') })}
            />
          ))}
        </div>
      )}
      {modal && <GeneralFormDialog item={modal.item} onClose={() => setModal(null)} />}
    </div>
  );
};
