import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetEmails } from './hooks/useGetEmails.hook';
import { useDeleteEmail } from './hooks/useDeleteEmail.hook';
import { AccountCard } from './components/AccountCard';
import { EmailFormDialog } from './components/EmailFormDialog';
import { FilterChip } from './components/FilterChip';
import type { AccountOutletContext } from './AccountPage';
import type { AccountEmail } from './models/account.model';

const getEmailIcon = (provider: string) => {
  if (provider === 'gmail') return '/svg/gmail.svg';
  if (provider === 'outlook') return '/svg/outlook.svg';
  return '/svg/google.svg';
};

export const EmailPage = () => {
  const { search } = useOutletContext<AccountOutletContext>();
  const [modal, setModal] = useState<{ item?: AccountEmail } | null>(null);
  const [filters, setFilters] = useState({ gmail: true, outlook: true, otro: true });

  const { data, isLoading } = useGetEmails();
  const deleteMutation = useDeleteEmail();

  const toggle = (key: keyof typeof filters) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  const filtered = data?.filter((e) => {
    const matchSearch = e.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      (e.provider === 'gmail' && filters.gmail) ||
      (e.provider === 'outlook' && filters.outlook) ||
      (e.provider !== 'gmail' && e.provider !== 'outlook' && filters.otro);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        <FilterChip label="Gmail" icon="/svg/gmail.svg" active={filters.gmail} onChange={() => toggle('gmail')} />
        <FilterChip label="Outlook" icon="/svg/outlook.svg" active={filters.outlook} onChange={() => toggle('outlook')} />
        <FilterChip label="Otro" active={filters.otro} onChange={() => toggle('otro')} />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered?.map((e) => (
            <AccountCard
              key={e.id}
              title={e.email}
              icon={getEmailIcon(e.provider)}
              password={e.password}
              fields={[
                { label: 'Celular', value: e.phone },
                { label: 'Recovery', value: e.recoveryEmail },
              ]}
              onEdit={() => setModal({ item: e })}
              onDelete={() => deleteMutation.mutate(e.id, { onSuccess: () => toast.success('Eliminado') })}
            />
          ))}
        </div>
      )}
      {modal && <EmailFormDialog item={modal.item} onClose={() => setModal(null)} />}
    </div>
  );
};
