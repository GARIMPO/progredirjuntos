import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAuthenticated) {
    // Salvar a URL atual para redirecionamento após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderizar os filhos (a página protegida)
  return <>{children}</>;
};

export default ProtectedRoute; 