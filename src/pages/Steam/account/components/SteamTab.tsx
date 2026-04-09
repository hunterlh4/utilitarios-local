import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetSteams } from '../hooks/useGetSteams.hook';
import { useDeleteSteam } from '../hooks/useDeleteSteam.hook';
import { AccountCard } from './AccountCard';
import { SteamFormDialog } from './SteamFormDialog';
import { FilterChip } from './FilterChip';
import type { AccountSteam } from '../models/account.model';

export const SteamTab = ({ search = '', isActive = true }: { search?: string; isActive?: boolean }) => {
  const { data, isLoading } = useGetSteams(isActive);
  const deleteMutation = useDeleteSteam();
  const [modal, setModal] = useState<{ item?: AccountSteam } | null>(null);
  const [filters, setFilters] = useState({ dota2: true, cs2: true, mobile: true, unlimited: true, banned:true });

  const toggle = (key: keyof typeof filters) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const filtered = data?.filter((s) => {
    const matchSearch = s.username.toLowerCase().includes(search.toLowerCase()) ||
      (s.emailAddress ?? '').toLowerCase().includes(search.toLowerCase());

    // Si todos los filtros están activos, muestra todo
    const allActive = Object.values(filters).every(Boolean);
    if (allActive) return matchSearch;

    // Muestra la cuenta si tiene AL MENOS UNA de las propiedades con filtro activo
    const matchFilter =
      (filters.dota2 && s.hasDota2) ||
      (filters.cs2 && s.hasCS2) ||
      (filters.mobile && s.hasSteamMobile) ||
      (filters.unlimited && s.isUnlimited);

    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-3 pt-4">
      <div className="flex gap-1 flex-wrap">
        <FilterChip label="Dota 2" icon="/svg/dota2.svg" active={filters.dota2} onChange={() => toggle('dota2')} />
        <FilterChip label="CS2" icon="/svg/cs2.svg" active={filters.cs2} onChange={() => toggle('cs2')} />
        <FilterChip label="Mobile" icon="/svg/device.svg" active={filters.mobile} onChange={() => toggle('mobile')} />
        <FilterChip label="Ilimitada" icon="/svg/facebook.svg" active={filters.unlimited} onChange={() => toggle('unlimited')} />
          <FilterChip label="Banned" icon="/svg/prohibido.svg" active={filters.banned} onChange={() => toggle('banned')} />
      </div>
      {isLoading ? <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div> : (
        <div className="space-y-3">
          {filtered?.map((s) => (
            <AccountCard
              key={s.id}
              title={s.username}
              icon="/svg/steam-svgrepo-com.svg"
              password={s.password}
              profileUrl={s.profileUrl}
              fields={[
                { label: 'Correo', value: s.emailAddress },
                { label: 'Celular', value: s.phone },
              ]}
              badges={
                <div className="flex gap-2 flex-wrap pt-0.5 items-center">
                  {s.hasDota2 && <img src="/svg/dota2.svg" alt="Dota 2" className="w-5 h-5" title="Dota 2" />}
                  {s.hasCS2 && <img src="/svg/cs2.svg" alt="CS2" className="w-5 h-5" title="CS2" />}
                  {s.isUnlimited && <img src="/svg/facebook.svg" alt="Ilimitada" className="w-5 h-5" title="Ilimitada" />}
                  {s.hasSteamMobile && <img src="/svg/device.svg" alt="Mobile" className="w-5 h-5" title="Steam Mobile" />}
                  {s.isVacBanned && <img src="/svg/prohibido.svg" alt="isVacBanned" className="w-5 h-5" title="Steam isVacBanned" />}
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
