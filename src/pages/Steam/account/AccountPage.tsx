import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { EmailTab } from './components/EmailTab';
import { SteamTab } from './components/SteamTab';
import { GitHubTab } from './components/GitHubTab';
import { GeneralTab } from './components/GeneralTab';
import { KiroTab } from './components/KiroTab';
import { EmailFormDialog } from './components/EmailFormDialog';
import { SteamFormDialog } from './components/SteamFormDialog';
import { GitHubFormDialog } from './components/GitHubFormDialog';
import { GeneralFormDialog } from './components/GeneralFormDialog';
import { KiroFormDialog } from './components/KiroFormDialog';

export const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearch('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-4">
      <h1 className="text-3xl font-bold">Cuentas</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center gap-2">
          <TabsList>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="steam">Steam</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="kiro">Kiro</TabsTrigger>
          </TabsList>
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pl-8 h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />Nuevo
          </Button>        </div>

        <TabsContent value="email"><EmailTab search={search} isActive={activeTab === 'email'} /></TabsContent>
        <TabsContent value="steam"><SteamTab search={search} isActive={activeTab === 'steam'} /></TabsContent>
        <TabsContent value="github"><GitHubTab search={search} isActive={activeTab === 'github'} /></TabsContent>
        <TabsContent value="general"><GeneralTab search={search} isActive={activeTab === 'general'} /></TabsContent>
        <TabsContent value="kiro"><KiroTab search={search} isActive={activeTab === 'kiro'} /></TabsContent>
      </Tabs>

      {addOpen && activeTab === 'email' && <EmailFormDialog onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'steam' && <SteamFormDialog onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'github' && <GitHubFormDialog onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'general' && <GeneralFormDialog onClose={() => setAddOpen(false)} />}
      {addOpen && activeTab === 'kiro' && <KiroFormDialog onClose={() => setAddOpen(false)} />}
    </div>
  );
};
