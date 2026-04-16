import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useDarkMode } from '@/common/hooks/useDarkMode.hook';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';

export const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isActiveSection = (section: string) => location.pathname.startsWith(`/${section}`);

  const menuItems = [
    {
      label: 'Ver',
      items: [
        { label: 'Anime', path: '/ver/anime' },
        { label: 'Hentai', path: '/ver/hentai' },
        { label: 'JAV', path: '/ver/jav' },
        { label: 'Series', path: '/ver/series' },
        { label: 'Actrices AV', path: '/ver/actress-jav' },
        { label: 'Actrices', path: '/ver/actress-adult' },
        { label: 'YouTube', path: '/ver/youtube' },
      ],
    },
    {
      label: 'Galería',
      items: [
        { label: 'Anime', path: '/galeria/anime' },
        { label: 'Chicas', path: '/galeria/girl' },
      ],
    },
    {
      label: 'Steam',
      items: [
        { label: 'Cuentas', path: '/steam/account' },
        { label: 'Búsqueda', path: '/steam/search' },
        { label: 'Drops', path: '/steam/drops' },
        { label: 'Compras', path: '/steam/purchase' },
      ],
    },
    {
      label: 'Dota',
      items: [
        { label: 'Héroes', path: '/steam/dota/hero' },
        { label: 'Cofres', path: '/steam/dota/treasure' },
        { label: 'Cache', path: '/steam/dota/cache' },
        { label: 'Vendedores', path: '/steam/dota/seller' },
      ],
    },
    {
      label: 'Dinero',
      items: [
        { label: 'Personas', path: '/dinero/person' },
        { label: 'Pagos', path: '/dinero/payment' },
        { label: 'Sueldo', path: '/dinero/salary' },
      ],
    },
    {
      label: 'Utilitarios',
      items: [
        { label: 'Proyectos', path: '/utilitarios/project' },
        { label: 'Posts', path: '/utilitarios/post' },
        { label: 'Tareas', path: '/utilitarios/task' },
        { label: 'Eventos', path: '/utilitarios/event' },
        { label: 'OGame', path: '/utilitarios/ogame' },
        { label: 'Tags', path: '/utilitarios/tag' },
      ],
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Utilitarios Local
        </Link>

        <div className="flex gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-colors text-sm font-medium ${
              isActive('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-white'
            }`}
          >
            Inicio
          </Link>
          {menuItems.map((menu) => (
            <DropdownMenu key={menu.label}>
              <DropdownMenuTrigger
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 outline-none focus:outline-none focus-visible:ring-0 text-sm font-medium ${
                  isActiveSection(menu.label.toLowerCase()) ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-white'
                }`}
              >
                {menu.label}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-1 flex flex-col gap-0.5">
                {menu.items.map((item) => (
                  <DropdownMenuItem key={item.path} asChild className="focus:bg-primary focus:text-primary-foreground cursor-pointer rounded-md">
                    <Link
                      to={item.path}
                      className={`w-full ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                          : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-primary transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  );
};
