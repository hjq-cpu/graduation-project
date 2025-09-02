import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getValidToken } from '../utils/tokenUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = getValidToken();

  if (!token) {
    // 如果没有有效token，重定向到登录页面
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 