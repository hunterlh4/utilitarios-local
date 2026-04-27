import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetSteams } from './hooks/useGetSteams.hook';
import { useDeleteSteam } from './hooks/useDeleteSteam.hook';
import { AccountCard } from './components/AccountCard';
import { SteamFormDialog } from './components/SteamFormDialog';
import { FilterChip } from './components/FilterChip';
import type { AccountOutletContext } from './AccountPage';
import type { AccountSteam } from './models/account.model';

export const SteamAccountPage = () => {
  const { search } = useOutletContext<AccountOutletContext>();
  const [modal, setModal] = useState<{ item?: AccountSteam } | null>(null);
  const [filters, setFilters] = useState({ dota2: true, cs2: true, mobile: true, unlimited: true, banned: true });

  const { data, isLoading } = useGetSteams();
  const deleteMutation = useDeleteSteam();

  const toggle = (key: keyof typeof filters) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const filtered = data?.filter((s) => {
    const matchSearch =
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      (s.emailAddress ?? '').toLowerCase().includes(search.toLowerCase());
    const allActive = Object.values(filters).every(Boolean);
    if (allActive) return matchSearch;
    const matchFilter =
      (filters.dota2 && s.hasDota2) ||
      (filters.cs2 && s.hasCS2) ||
      (filters.mobile && s.hasSteamMobile) ||
      (filters.unlimited && s.isUnlimited);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        <FilterChip label="Dota 2" icon="/svg/dota2.svg" active={filters.dota2} onChange={() => toggle('dota2')} />
        <FilterChip label="CS2" icon="/svg/cs2.svg" active={filters.cs2} onChange={() => toggle('cs2')} />
        <FilterChip label="Mobile" icon="/svg/device.svg" active={filters.mobile} onChange={() => toggle('mobile')} />
        <FilterChip label="Ilimitada" icon="/svg/steam-svgrepo-com.svg" active={filters.unlimited} onChange={() => toggle('unlimited')} />
        <FilterChip label="Banned" icon="/svg/prohibido.svg" active={filters.banned} onChange={() => toggle('banned')} />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered?.map((s) => (
            <AccountCard
              key={s.id}
              title={s.username}
              password={s.password}
              profileUrl={s.profileUrl}
              fields={[
                { label: 'Correo', value: s.emailAddress },
                { label: 'Celular', value: s.phone },
              ]}
              badges={
                <div className="flex gap-2 flex-wrap pt-0.5 items-center">
                  {s.hasDota2 && <img src="/svg/dota2.svg" alt="Dota 2" className="w-5 h-5" />}
                  {s.hasCS2 && <img src="/svg/cs2.svg" alt="CS2" className="w-5 h-5" />}
                  {s.isUnlimited && <img src="/svg/steam-svgrepo-com.svg" alt="Ilimitada" className="w-5 h-5" />}
                  {s.hasSteamMobile && <img src="/svg/device.svg" alt="Mobile" className="w-5 h-5" />}
                  {s.isVacBanned && <img src="/svg/prohibido.svg" alt="VAC Banned" className="w-5 h-5" />}
                </div>
              }
              onEdit={() => setModal({ item: s })}
              onDelete={() => deleteMutation.mutate(s.id, { onSuccess: () => toast.success('Eliminado') })}
            />
          ))}
        </div>
      )}
      {modal && <SteamFormDialog item={modal.item} onClose={() => setModal(null)} />}
    </div>
  );
};
