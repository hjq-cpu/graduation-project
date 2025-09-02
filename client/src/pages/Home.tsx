import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GroupOutlined
} from '@ant-design/icons';
import { authService } from '../services/auth';
import { User } from '../types/auth';
const { Header, Sider, Content } = Layout;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 如果在主页，自动重定向到聊天页面
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat');
    }
    loadUserProfile();
  }, [location.pathname, navigate]);

  const loadUserProfile = async () => {
    try {
      const response = await authService.getUserProfile();
      if (response.success) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('加载用户信息失败', error);
      // 不要在这里清除token，让响应拦截器处理
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="settings" onClick={() => navigate('/settings')}>
        <SettingOutlined /> 设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );

  // 根据当前路径确定选中的菜单项
  const selectedKey = location.pathname.split('/')[1] || 'chat';

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={200}
        collapsedWidth={80}
        style={{
          borderRight: '1px solid #f0f0f0',
          background: '#fff'
        }}
      >
        <div style={{
          padding: '16px',
          textAlign: 'left',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{
            height: 'calc(100% - 64px)',
            borderRight: 0,
            paddingTop: '8px'
          }}
        >
          <Menu.Item
            key="chat"
            icon={<MessageOutlined />}
            onClick={() => navigate('/chat')}
          >
            聊天
          </Menu.Item>
          <Menu.Item
            key="contacts"
            icon={<TeamOutlined />}
            onClick={() => navigate('/contacts')}
          >
            联系人
          </Menu.Item>
          <Menu.Item
            key="groups"
            icon={<GroupOutlined />}
            onClick={() => navigate('/groups')}
          >
            群组
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}; 