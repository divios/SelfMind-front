import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function HeaderActions() {
  const { logout } = useAuth();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="h-10 w-10"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
} 