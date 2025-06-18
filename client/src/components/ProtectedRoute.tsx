import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // 如果没有token，重定向到登录页面
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 