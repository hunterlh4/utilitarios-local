import { useState } from 'react';
import { useGetAllAccounts } from './hooks/useGetAllAccounts.hook';
import { useDeleteAccount } from './hooks/useDeleteAccount.hook';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Account } from './models/account.model';
import { AccountType, AccountTypeLabels, AccountPropertyLabels } from './enums/account.enum';

export const AccountPage = () => {
  const { data: accounts, isLoading } = useGetAllAccounts();
  const deleteAccount = useDeleteAccount();
  const [expandedAccounts, setExpandedAccounts] = useState<Set<number>>(new Set());
  const [showPasswords, setShowPasswords] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAccounts(newExpanded);
  };

  const togglePassword = (id: number) => {
    const newShow = new Set(showPasswords);
    if (newShow.has(id)) {
      newShow.delete(id);
    } else {
      newShow.add(id);
    }
    setShowPasswords(newShow);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount.mutateAsync(id);
      toast.success('Cuenta eliminada');
    } catch (error) {
      toast.error('Error al eliminar cuenta');
    }
  };

  // Organizar cuentas en jerarquía
  const parentAccounts = accounts?.filter(acc => acc.type === AccountType.Email) || [];
  
  const getChildAccounts = (parentId: number): Account[] => {
    const parent = accounts?.find(a => a.id === parentId);
    if (!parent?.relations) return [];
    
    return parent.relations
      .map(rel => accounts?.find(a => a.id === rel.childAccountId))
      .filter((acc): acc is Account => acc !== undefined);
  };

  const renderProperties = (account: Account) => {
    if (!account.properties || account.properties.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {account.properties.map((prop) => (
          <span
            key={prop.id}
            className={`text-xs px-2 py-1 rounded ${
              prop.value
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {AccountPropertyLabels[prop.key]}
          </span>
        ))}
      </div>
    );
  };

  const renderAccount = (account: Account, isChild = false) => {
    const isExpanded = expandedAccounts.has(account.id);
    const showPassword = showPasswords.has(account.id);
    const children = getChildAccounts(account.id);
    const hasChildren = children.length > 0;

    return (
      <div key={account.id} className={`${isChild ? 'ml-8' : ''}`}>
        <div className="bg-background border rounded-lg p-4 mb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(account.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {AccountTypeLabels[account.type]}
                </span>
                <span className="font-semibold">{account.name}</span>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                {account.username && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Usuario:</span>
                    <span className="font-mono">{account.username}</span>
                  </div>
                )}
                {account.password && (
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground">Password:</span>
                    <span className="font-mono">
                      {showPassword ? account.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => togglePassword(account.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                )}
                {account.profileUrl && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">URL:</span>
                    <a
                      href={account.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {account.profileUrl}
                    </a>
                  </div>
                )}
                {account.phoneNumber && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span>{account.phoneNumber}</span>
                  </div>
                )}
                {account.recoveryEmail && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Recovery:</span>
                    <span>{account.recoveryEmail}</span>
                  </div>
                )}
                {account.lastConnection && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Última conexión:</span>
                    <span>{new Date(account.lastConnection).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {renderProperties(account)}
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(account.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && children.map((child) => renderAccount(child, true))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cuentas</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cuenta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : parentAccounts.length > 0 ? (
        <div className="space-y-4">
          {parentAccounts.map((account) => renderAccount(account))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">No hay cuentas registradas</p>
      )}
    </div>
  );
};
