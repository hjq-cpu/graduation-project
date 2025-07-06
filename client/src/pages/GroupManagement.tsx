import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  Modal, 
  message, 
  Spin,
  Typography,
  Space,
  Tag
} from 'antd';
import { 
  TeamOutlined, 
  UserAddOutlined, 
  SettingOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Group, GroupMember, GroupRole } from '../types/group';
import { groupService } from '../services/group';
import GroupMemberList from '../components/Group/GroupMemberList';
import InviteMembersModal from '../components/Group/InviteMembersModal';
import { useAuth } from '../hooks/useAuth';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const GroupManagement: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<GroupRole>(GroupRole.MEMBER);

  // 获取群组详情
  const fetchGroupDetails = async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const groupData = await groupService.getGroup(groupId);
      setGroup(groupData);
      
      // 获取当前用户在群组中的角色
      const currentMember = groupData.members.find(member => member.user.id === user?.id);
      if (currentMember) {
        setCurrentUserRole(currentMember.role);
      }
    } catch (error) {
      message.error('获取群组信息失败');
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  // 处理成员更新
  const handleMemberUpdate = () => {
    fetchGroupDetails();
  };

  // 处理邀请成功
  const handleInviteSuccess = () => {
    fetchGroupDetails();
  };

  // 退出群组
  const handleLeaveGroup = () => {
    if (!group) return;

    Modal.confirm({
      title: '确认退出群组',
      icon: <ExclamationCircleOutlined />,
      content: `确定要退出群组 "${group.name}" 吗？`,
      okText: '确认退出',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await groupService.leaveGroup(group.id);
          message.success('已退出群组');
          navigate('/groups');
        } catch (error) {
          message.error('退出群组失败');
        }
      }
    });
  };

  // 删除群组（仅群主）
  const handleDeleteGroup = () => {
    if (!group) return;

    Modal.confirm({
      title: '确认删除群组',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>确定要删除群组 "{group.name}" 吗？</p>
          <p style={{ color: '#ff4d4f' }}>
            此操作不可恢复，群组内的所有数据将被永久删除！
          </p>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await groupService.deleteGroup(group.id);
          message.success('群组已删除');
          navigate('/groups');
        } catch (error) {
          message.error('删除群组失败');
        }
      }
    });
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <Text>群组不存在</Text>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        {/* 群组信息头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-white text-2xl" />
              </div>
              <div>
                <Title level={3} className="mb-1">
                  {group.name}
                </Title>
                <div className="flex items-center space-x-2">
                  <Text type="secondary">
                    成员 {group.memberCount} 人
                  </Text>
                  <Text type="secondary">•</Text>
                  <Text type="secondary">
                    创建于 {new Date(group.createdAt).toLocaleDateString()}
                  </Text>
                  {group.isPrivate && (
                    <>
                      <Text type="secondary">•</Text>
                      <Tag color="orange">私密群组</Tag>
                    </>
                  )}
                </div>
                {group.description && (
                  <Text type="secondary" className="block mt-1">
                    {group.description}
                  </Text>
                )}
              </div>
            </div>
            
            <Space>
              {currentUserRole === GroupRole.OWNER && (
                <Button 
                  danger 
                  icon={<SettingOutlined />}
                  onClick={handleDeleteGroup}
                >
                  删除群组
                </Button>
              )}
              <Button 
                danger 
                onClick={handleLeaveGroup}
              >
                退出群组
              </Button>
            </Space>
          </div>
        </div>

        {/* 标签页 */}
        <Tabs defaultActiveKey="members">
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                群成员
              </span>
            } 
            key="members"
          >
            <GroupMemberList
              groupId={group.id}
              members={group.members}
              currentUserId={user?.id || ''}
              currentUserRole={currentUserRole}
              onMemberUpdate={handleMemberUpdate}
              onInviteMembers={() => setInviteModalVisible(true)}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                群设置
              </span>
            } 
            key="settings"
          >
            <div className="p-4">
              <Text>群设置功能开发中...</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 邀请成员模态框 */}
      <InviteMembersModal
        visible={inviteModalVisible}
        groupId={group.id}
        existingMemberIds={group.members.map(member => member.user.id)}
        onCancel={() => setInviteModalVisible(false)}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
};

export default GroupManagement; 