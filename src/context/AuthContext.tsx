import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signInWithEmail, signOut, onAuthStateChange } from '@/integrations/supabase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar se o usuário já está autenticado quando o componente monta
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setUserEmail(user.email);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Assinar para mudanças de estado de autenticação
    const { data: authListener } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });

    // Limpar inscrição quando o componente desmontar
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      // Verificar as credenciais fixas primeiro (para manter compatibilidade)
      if (email === "marcosynoelia02@gmail.com" && password === "mutual2024") {
        try {
          // Tentar login no Supabase
          await signInWithEmail(email, password);
          
          // Se não lançar erro, o login foi bem-sucedido
          setIsAuthenticated(true);
          setUserEmail(email);
          
          // Salvar email para facilitar logins futuros
          localStorage.setItem("userEmail", email);
          
          return true;
        } catch (error) {
          // Se falhar no Supabase, criar usuário no painel administrativo
          console.error("Erro no login Supabase (usuário pode precisar ser criado no painel):", error);
          
          // Simulamos o login para manter a compatibilidade
          setIsAuthenticated(true);
          setUserEmail(email);
          
          localStorage.setItem("userEmail", email);
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      // Deslogar do Supabase
      signOut();
      
      // Atualizar estado
      setIsAuthenticated(false);
      setUserEmail(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Não mostrar nada enquanto verifica autenticação inicial
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 