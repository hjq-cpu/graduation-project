import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Title level={3} style={{ margin: 0 }}>我的应用</Title>
        <Button type="primary" onClick={handleLogout}>
          退出登录
        </Button>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Title level={2}>欢迎回来！</Title>
          <Paragraph>
            这是一个受保护的路由页面，只有登录后才能访问。
          </Paragraph>
        </div>
      </Content>
    </Layout>
  );
}; 