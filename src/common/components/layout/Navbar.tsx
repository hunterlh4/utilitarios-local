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
        { label: 'Actrices', path: '/ver/actress' },
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
            className={`px-3 py-2 rounded-md hover:bg-accent transition-colors ${
              isActive('/') ? 'bg-accent font-semibold' : ''
            }`}
          >
            Inicio
          </Link>
          {menuItems.map((menu) => (
            <DropdownMenu key={menu.label}>
              <DropdownMenuTrigger
                className={`px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center gap-1 ${
                  isActiveSection(menu.label.toLowerCase()) ? 'bg-accent font-semibold' : ''
                }`}
              >
                {menu.label}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {menu.items.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className={`w-full ${
                        isActive(item.path) ? 'bg-accent font-semibold' : ''
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
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  );
};
