import { useState } from 'react';
import { Sparkles, Sun, Moon, User as UserIcon } from 'lucide-react';
import { Button } from './ui';
import { LogoutModal } from './LogoutModal';
import { useTheme } from '../hooks/useTheme';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const ThemeIcon = theme === 'light' ? Sun : Moon;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl">
                <span className="font-bold text-slate-900 dark:text-white">Taski</span>
                <span className="text-indigo-600">.ai</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                title={`Theme: ${theme}`}
              >
                <ThemeIcon className="w-5 h-5" />
              </button>

              {user && (
                <>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {user.name || user.username}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogoutClick}>
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};
