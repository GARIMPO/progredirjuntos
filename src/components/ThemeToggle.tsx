import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm rounded-full w-10 h-10"
      title={theme === 'pink' ? 'Mudar para tema azul' : 'Mudar para tema rosa'}
    >
      {theme === 'pink' ? (
        <Heart size={20} className="text-primary" />
      ) : (
        <Palette size={20} className="text-primary" />
      )}
    </Button>
  );
};

export default ThemeToggle; 