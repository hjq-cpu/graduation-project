import React from 'react';
import { Avatar, Typography, Space, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../types/auth';

const { Text, Title } = Typography;

interface UserProfileProps {
  user: User;
  showSignature?: boolean;
  showStatus?: boolean;
  size?: 'small' | 'default' | 'large';
  layout?: 'horizontal' | 'vertical';
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  showSignature = true,
  showStatus = true,
  size = 'default',
  layout = 'horizontal'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'away':
        return 'orange';
      case 'busy':
        return 'red';
      case 'offline':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'away':
        return '离开';
      case 'busy':
        return '忙碌';
      case 'offline':
        return '离线';
      default:
        return '未知';
    }
  };

  const avatarSize = size === 'small' ? 32 : size === 'large' ? 64 : 48;

  if (layout === 'vertical') {
    return (
      <div className="text-center">
        <Avatar
          size={avatarSize}
          src={user.avatar}
          icon={<UserOutlined />}
        />
        <div className="mt-2">
          <Title level={size === 'small' ? 5 : 4} className="mb-1">
            {user.username}
          </Title>
          {showStatus && (
            <Tag color={getStatusColor(user.status)}>
              {getStatusText(user.status)}
            </Tag>
          )}
          {showSignature && user.signature && (
            <div className="mt-1">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {user.signature}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Space>
      <Avatar
        size={avatarSize}
        src={user.avatar}
        icon={<UserOutlined />}
      />
      <div>
        <div className="flex items-center space-x-2">
          <Text strong>{user.username}</Text>
          {showStatus && (
            <Tag color={getStatusColor(user.status)} >
              {getStatusText(user.status)}
            </Tag>
          )}
        </div>
        {showSignature && user.signature && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user.signature}
          </Text>
        )}
      </div>
    </Space>
  );
};

export default UserProfile; 