import { useRef, useState } from 'react';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { Search, Plus, ChevronDown, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { accountService } from './services/account.service';
import { downloadBase64File } from '@/common/lib/download-file';
import { EmailFormDialog } from './components/EmailFormDialog';
import { SteamFormDialog } from './components/SteamFormDialog';
import { GitHubFormDialog } from './components/GitHubFormDialog';
import { GeneralFormDialog } from './components/GeneralFormDialog';
import { KiroFormDialog } from './components/KiroFormDialog';

const TABS = [
  { value: 'email',   label: 'Email',   path: '/steam/account/email' },
  { value: 'steam',   label: 'Steam',   path: '/steam/account/steam' },
  { value: 'github',  label: 'GitHub',  path: '/steam/account/github' },
  { value: 'general', label: 'General', path: '/steam/account/general' },
  { value: 'kiro',    label: 'Kiro',    path: '/steam/account/kiro' },
];

export type AccountOutletContext = { search: string };

export const AccountPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const activeTab = TABS.find((t) => pathname.startsWith(t.path))?.value ?? '';

  if (!activeTab) return <Navigate to="/steam/account/email" replace />;

  const handleTabChange = (v: string) => {
    navigate(TABS.find((t) => t.value === v)!.path);
    setSearch('');
  };

  const exportMutation = useMutation({
    mutationFn: () => accountService.exportExcel(),
    onSuccess: (file) => {
      downloadBase64File(file.base64, file.fileName || 'accounts.xlsx');
      toast.success('Exportación completada');
    },
    onError: () => toast.error('Error al exportar'),
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => accountService.importExcel(file),
    onSuccess: (result) => {
      toast.success(`Importación lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Inválidos: ${result.invalid}`);
    },
    onError: () => toast.error('Error al importar'),
  });

  const handleExport = async () => {
    setIsExporting(true);
    try { await exportMutation.mutateAsync(); }
    finally { setIsExporting(false); }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importMutation.mutateAsync(file);
    e.target.value = '';
  };

  const isBusy = isExporting || importMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto space-y-4 pt-4">
      <h1 className="text-3xl font-bold">Cuentas</h1>
      <input ref={importInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile} />
      <div className="flex items-center gap-2">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="pl-8 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* Split button: Nuevo + dropdown */}
        <div className="flex items-center overflow-hidden rounded-md">
          <Button onClick={() => setAddOpen(true)} className="rounded-none border-0">
            <Plus className="h-4 w-4 mr-1" />Nuevo
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                disabled={isBusy}
                className="rounded-none border-0 border-l border-primary-foreground/25 px-2"
                aria-label="Acciones Excel"
              >
                {isBusy ? <Spinner className="h-4 w-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 bg-primary">
              <DropdownMenuItem
                onClick={handleExport}
                className="h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
              >
                <Download className="mr-2 h-4 w-4" /> Exportar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => importInputRef.current?.click()}
                className="mt-1 h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
              >
                <Upload className="mr-2 h-4 w-4" /> Importar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Outlet context={{ search } satisfies AccountOutletContext} />

      {addOpen && activeTab === 'email'   && <EmailFormDialog   onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'steam'   && <SteamFormDialog   onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'github'  && <GitHubFormDialog  onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'general' && <GeneralFormDialog onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'kiro'    && <KiroFormDialog    onClose={() => setAddOpen(false)} />}
    </div>
  );
};
