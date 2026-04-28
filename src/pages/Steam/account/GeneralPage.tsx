import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetGenerals } from './hooks/useGetGenerals.hook';
import { useDeleteGeneral } from './hooks/useDeleteGeneral.hook';
import { AccountCard } from './components/AccountCard';
import { GeneralFormDialog } from './components/GeneralFormDialog';
import { FilterChip } from './components/FilterChip';
import { GeneralPlatform, GeneralPlatformLabels } from './models/account.model';
import type { AccountOutletContext } from './AccountPage';
import type { AccountGeneral } from './models/account.model';

const platformIcons: Partial<Record<GeneralPlatform, string>> = {
  [GeneralPlatform.Facebook]: '/svg/facebook.svg',
};

export const GeneralPage = () => {
  const { search } = useOutletContext<AccountOutletContext>();
  const [modal, setModal] = useState<{ item?: AccountGeneral } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<GeneralPlatform>>(
    new Set(Object.values(GeneralPlatform).filter((v) => typeof v === 'number') as GeneralPlatform[])
  );

  const { data, isLoading } = useGetGenerals();
  const deleteMutation = useDeleteGeneral();

  const toggleFilter = (p: GeneralPlatform) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };

  const filtered = data?.filter((g) => {
    const matchSearch =
      g.username.toLowerCase().includes(search.toLowerCase()) ||
      GeneralPlatformLabels[g.platform].toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilters.size === 0 || activeFilters.has(g.platform);
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 gap-2 flex-wrap">
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
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
        ) : filtered?.length ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((g) => (
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
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {search ? 'No hay cuentas generales que coincidan con la búsqueda.' : 'No hay cuentas generales cargadas.'}
          </p>
        )}
      </div>
      {modal && <GeneralFormDialog item={modal.item} onClose={() => setModal(null)} />}
    </div>
  );
};
