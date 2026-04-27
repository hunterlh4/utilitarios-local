import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { TAG_TABS } from './models/tag.model';

export const TagPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeTab = TAG_TABS.find((tab) => pathname.endsWith(tab.path))?.path ?? TAG_TABS[0].path;

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pt-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-primary/0 p-1 rounded-lg h-auto gap-1">
            {TAG_TABS.map((tab) => (
              <TabsTrigger
                key={tab.path}
                value={tab.path}
                className="px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Outlet />
    </div>
  );
};
