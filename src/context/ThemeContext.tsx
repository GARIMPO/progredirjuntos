import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'pink' | 'blue';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'pink',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Verificar se há um tema salvo no localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'blue' ? 'blue' : 'pink') as Theme;
  });

  // Aplicar as variáveis CSS de acordo com o tema
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'blue') {
      // Tema azul
      root.style.setProperty('--background', '210 25% 97%');
      root.style.setProperty('--foreground', '210 10% 20%');
      
      root.style.setProperty('--card', '210 25% 98%');
      root.style.setProperty('--card-foreground', '210 10% 20%');
      
      root.style.setProperty('--popover', '210 25% 98%');
      root.style.setProperty('--popover-foreground', '210 10% 20%');
      
      root.style.setProperty('--primary', '210 100% 50%');
      root.style.setProperty('--primary-foreground', '210 10% 98%');
      
      root.style.setProperty('--secondary', '210 30% 92%');
      root.style.setProperty('--secondary-foreground', '210 10% 30%');
      
      root.style.setProperty('--muted', '210 25% 92%');
      root.style.setProperty('--muted-foreground', '210 10% 50%');
      
      root.style.setProperty('--accent', '210 30% 92%');
      root.style.setProperty('--accent-foreground', '210 10% 30%');
      
      root.style.setProperty('--border', '210 30% 90%');
      root.style.setProperty('--input', '210 30% 90%');
      root.style.setProperty('--ring', '210 100% 50%');

      // Variável personalizada para elementos específicos
      document.documentElement.style.setProperty('--love-dark', '210 100% 40%');
    } else {
      // Tema rosa (padrão)
      root.style.setProperty('--background', '340 25% 97%');
      root.style.setProperty('--foreground', '340 10% 20%');
      
      root.style.setProperty('--card', '340 25% 98%');
      root.style.setProperty('--card-foreground', '340 10% 20%');
      
      root.style.setProperty('--popover', '340 25% 98%');
      root.style.setProperty('--popover-foreground', '340 10% 20%');
      
      root.style.setProperty('--primary', '340 60% 65%');
      root.style.setProperty('--primary-foreground', '340 10% 98%');
      
      root.style.setProperty('--secondary', '340 30% 92%');
      root.style.setProperty('--secondary-foreground', '340 10% 30%');
      
      root.style.setProperty('--muted', '340 25% 92%');
      root.style.setProperty('--muted-foreground', '340 10% 50%');
      
      root.style.setProperty('--accent', '340 30% 92%');
      root.style.setProperty('--accent-foreground', '340 10% 30%');
      
      root.style.setProperty('--border', '340 30% 90%');
      root.style.setProperty('--input', '340 30% 90%');
      root.style.setProperty('--ring', '340 60% 70%');

      // Variável personalizada para elementos específicos
      document.documentElement.style.setProperty('--love-dark', '340 60% 55%');
    }

    // Salvar a preferência do usuário
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'pink' ? 'blue' : 'pink');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 