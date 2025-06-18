import React, { useState } from 'react';
import { Tabs } from 'antd';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');

  const items = [
    {
      key: 'login',
      label: '登录',
      children: <LoginForm />,
    },
    {
      key: 'register',
      label: '注册',
      children: <RegisterForm />,
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <div style={{ width: 400 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          centered
          size="large"
        />
      </div>
    </div>
  );
}; 