import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider } from 'antd';
import { TeamOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons';
import GroupMemberList from './GroupMemberList';
import InviteMembersModal from './InviteMembersModal';
import { GroupMember, GroupRole } from '../../types/group';

const { Title, Text } = Typography;

// 示例数据
const exampleMembers: GroupMember[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: '张三',
      email: 'zhangsan@example.com',
      avatar: '',
      status: 'online',
      online: true,
      unreadCount: 0,
      signature: '群主，负责管理群组',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    role: GroupRole.OWNER,
    joinTime: '2024-01-01T00:00:00Z',
    nickname: '群主',
    isOnline: true
  },
  {
    id: '2',
    user: {
      id: 'user2',
      username: '李四',
      email: 'lisi@example.com',
      avatar: '',
      status: 'online',
      online: true,
      unreadCount: 0,
      signature: '管理员，协助管理群组',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    role: GroupRole.ADMIN,
    joinTime: '2024-01-02T00:00:00Z',
    nickname: '管理员',
    isOnline: true
  },
  {
    id: '3',
    user: {
      id: 'user3',
      username: '王五',
      email: 'wangwu@example.com',
      avatar: '',
      status: 'away',
      online: false,
      unreadCount: 0,
      signature: '普通成员',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    role: GroupRole.MEMBER,
    joinTime: '2024-01-03T00:00:00Z',
    nickname: '',
    isOnline: false
  }
];

const GroupExample: React.FC = () => {
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  const handleMemberUpdate = () => {
    console.log('成员信息已更新');
  };

  const handleInviteMembers = () => {
    setInviteModalVisible(true);
  };

  const handleInviteSuccess = () => {
    console.log('邀请成功');
    setInviteModalVisible(false);
  };

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <Title level={2}>
            <TeamOutlined className="mr-2" />
            群成员管理功能示例
          </Title>
          <Text type="secondary">
            这是一个完整的群成员管理功能示例，展示了如何管理群组成员、角色和权限。
          </Text>
        </div>

        <Divider />

        <div className="mb-4">
          <Title level={4}>功能特性</Title>
          <Space direction="vertical" className="w-full">
            <div className="flex items-center space-x-2">
              <UserAddOutlined />
              <Text>邀请新成员加入群组</Text>
            </div>
            <div className="flex items-center space-x-2">
              <SettingOutlined />
              <Text>管理成员角色（群主、管理员、成员）</Text>
            </div>
            <div className="flex items-center space-x-2">
              <TeamOutlined />
              <Text>查看成员在线状态和加入时间</Text>
            </div>
            <div className="flex items-center space-x-2">
              <SettingOutlined />
              <Text>搜索和筛选群组成员</Text>
            </div>
          </Space>
        </div>

        <Divider />

        <div className="mb-4">
          <Title level={4}>权限说明</Title>
          <div className="space-y-2">
            <div>
              <Text strong>群主：</Text>
              <Text>可以管理所有成员，包括设置管理员、移除成员、删除群组</Text>
            </div>
            <div>
              <Text strong>管理员：</Text>
              <Text>可以邀请新成员，管理普通成员，但不能管理其他管理员</Text>
            </div>
            <div>
              <Text strong>成员：</Text>
              <Text>只能查看成员列表，不能进行管理操作</Text>
            </div>
          </div>
        </div>

        <Divider />

        <div>
          <Title level={4}>群成员列表</Title>
          <div className="border rounded-lg" style={{ height: '500px' }}>
            <GroupMemberList
              groupId="example-group"
              members={exampleMembers}
              currentUserId="user1"
              currentUserRole={GroupRole.OWNER}
              onMemberUpdate={handleMemberUpdate}
              onInviteMembers={handleInviteMembers}
            />
          </div>
        </div>

        {/* 邀请成员模态框 */}
        <InviteMembersModal
          visible={inviteModalVisible}
          groupId="example-group"
          existingMemberIds={exampleMembers.map(member => member.user.id)}
          onCancel={() => setInviteModalVisible(false)}
          onSuccess={handleInviteSuccess}
        />
      </Card>
    </div>
  );
};

export default GroupExample; 