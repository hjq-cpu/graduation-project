import React, { useState } from 'react';
import { 
  List, 
  Avatar, 
  Badge, 
  Input, 
  Typography, 
  Button, 
  Dropdown, 
  Menu, 
  Modal, 
  message,
  Tag,
  Space
} from 'antd';
import { 
  UserOutlined, 
  CrownOutlined, 
  TeamOutlined, 
  MoreOutlined,
  UserAddOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { GroupMember, GroupRole } from '../../types/group';
import { groupService } from '../../services/group';

const { Search } = Input;
const { Text, Title } = Typography;

interface GroupMemberListProps {
  groupId: string;
  members: GroupMember[];
  currentUserId: string;
  currentUserRole: GroupRole;
  onMemberUpdate: () => void;
  onInviteMembers: () => void;
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({
  groupId,
  members,
  currentUserId,
  currentUserRole,
  onMemberUpdate,
  onInviteMembers
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // 过滤成员
  const filteredMembers = members.filter(member =>
    member.user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    member.nickname?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 获取角色标签
  const getRoleTag = (role: GroupRole) => {
    switch (role) {
      case GroupRole.OWNER:
        return <Tag color="gold" icon={<CrownOutlined />}>群主</Tag>;
      case GroupRole.ADMIN:
        return <Tag color="blue" icon={<TeamOutlined />}>管理员</Tag>;
      case GroupRole.MEMBER:
        return <Tag color="default">成员</Tag>;
      default:
        return null;
    }
  };

  // 检查是否有权限操作
  const canManageMember = (targetRole: GroupRole, targetUserId: string) => {
    if (currentUserId === targetUserId) return false;
    
    if (currentUserRole === GroupRole.OWNER) return true;
    if (currentUserRole === GroupRole.ADMIN && targetRole === GroupRole.MEMBER) return true;
    
    return false;
  };

  // 移除成员
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    Modal.confirm({
      title: '确认移除成员',
      content: `确定要移除成员 "${memberName}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          await groupService.removeMember(groupId, memberId);
          message.success('成员移除成功');
          onMemberUpdate();
        } catch (error) {
          message.error('移除成员失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 更新成员角色
  const handleUpdateRole = async (memberId: string, newRole: GroupRole) => {
    try {
      setLoading(true);
      await groupService.updateMemberRole(groupId, { memberId, role: newRole });
      message.success('角色更新成功');
      onMemberUpdate();
    } catch (error) {
      message.error('角色更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 复制邀请码
  const handleCopyInviteCode = async () => {
    try {
      const { inviteCode } = await groupService.getInviteCode(groupId);
      navigator.clipboard.writeText(inviteCode);
      message.success('邀请码已复制到剪贴板');
    } catch (error) {
      message.error('获取邀请码失败');
    }
  };

  // 成员操作菜单
  const getMemberMenu = (member: GroupMember) => {
    const items = [];

    if (canManageMember(member.role, member.user.id)) {
      // 角色管理
      if (currentUserRole === GroupRole.OWNER) {
        if (member.role === GroupRole.MEMBER) {
          items.push({
            key: 'promote',
            label: '设为管理员',
            onClick: () => handleUpdateRole(member.id, GroupRole.ADMIN)
          });
        } else if (member.role === GroupRole.ADMIN) {
          items.push({
            key: 'demote',
            label: '取消管理员',
            onClick: () => handleUpdateRole(member.id, GroupRole.MEMBER)
          });
        }
      }

      // 移除成员
      items.push({
        key: 'remove',
        label: '移除成员',
        danger: true,
        onClick: () => handleRemoveMember(member.id, member.nickname || member.user.username)
      });
    }

    return items.length > 0 ? items : null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <Title level={5} className="mb-0">
            群成员 ({members.length})
          </Title>
          <Space>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={onInviteMembers}
              disabled={currentUserRole === GroupRole.MEMBER}
            >
              邀请成员
            </Button>
            <Button 
              icon={<CopyOutlined />}
              onClick={handleCopyInviteCode}
            >
              邀请码
            </Button>
          </Space>
        </div>
        <Search 
          placeholder="搜索成员" 
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <List
        className="flex-1 overflow-auto"
        loading={loading}
        itemLayout="horizontal"
        dataSource={filteredMembers}
        renderItem={member => (
          <List.Item 
            style={{ padding: '12px 16px' }}
            actions={
              getMemberMenu(member) ? [
                <Dropdown
                  key="actions"
                  menu={{ items: getMemberMenu(member) || [] }}
                  trigger={['click']}
                >
                  <Button 
                    type="text" 
                    icon={<MoreOutlined />} 
                    size="small"
                  />
                </Dropdown>
              ] : []
            }
          >
            <List.Item.Meta
              avatar={
                <Badge dot={member.isOnline} color="green">
                  <Avatar 
                    src={member.user.avatar}
                    icon={<UserOutlined />} 
                  />
                </Badge>
              }
              title={
                <div className="flex items-center space-x-2">
                  <Text strong>
                    {member.nickname || member.user.username}
                  </Text>
                  {member.nickname && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      ({member.user.username})
                    </Text>
                  )}
                  {getRoleTag(member.role)}
                </div>
              }
              description={
                <div>
                  {member.user.signature && (
                    <div className="mb-1">
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {member.user.signature}
                      </Text>
                    </div>
                  )}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    加入时间: {new Date(member.joinTime).toLocaleDateString()}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default GroupMemberList; 