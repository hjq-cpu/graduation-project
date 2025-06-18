import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/Auth/AuthPage';
import { Home } from './pages/Home';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Profile from '@/pages/Profile';
import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 认证路由 */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* 受保护的路由 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 重定向未匹配的路由到主页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
