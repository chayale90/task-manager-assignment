import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui';
import { LogoutModal } from './LogoutModal';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl">
                <span className="font-bold text-slate-900">Taski</span>
                <span className="text-indigo-600">.ai</span>
              </h1>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  {user.name || user.username}
                </span>
                <Button variant="danger" size="sm" onClick={handleLogoutClick}>
                  Logout
                </Button>
              </div>
            )}
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
