import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/Auth/AuthPage';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Contacts } from './pages/Contacts';
import { ProtectedRoute } from './components/ProtectedRoute';
import Groups from './pages/Groups';
import GroupManagement from './pages/GroupManagement';
import Settings from './pages/Settings';
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
        >
          {/* 嵌套路由 */}
          <Route path="chat" element={<Chat />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:groupId/management" element={<GroupManagement />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
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
