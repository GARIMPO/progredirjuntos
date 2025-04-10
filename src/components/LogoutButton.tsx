import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm rounded-full w-10 h-10"
      title="Sair"
    >
      <LogOut size={20} className="text-primary" />
    </Button>
  );
};

export default LogoutButton; 