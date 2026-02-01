import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/common/hooks/useDarkMode.hook';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Utilitarios Local
          </Link>
          <div className="flex gap-4">
            <Link
              to="/"
              className={`hover:text-primary transition-colors ${
                isActive('/') ? 'text-primary font-semibold' : ''
              }`}
            >
              Inicio
            </Link>
          </div>
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
