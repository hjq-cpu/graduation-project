import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Input, 
  List, 
  Avatar, 
  Checkbox, 
  Button, 
  message, 
  Spin,
  Empty,
  Typography
} from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { User } from '../../types/auth';
import { groupService } from '../../services/group';

const { Search } = Input;
const { Text } = Typography;

interface InviteMembersModalProps {
  visible: boolean;
  groupId: string;
  existingMemberIds: string[];
  onCancel: () => void;
  onSuccess: () => void;
}

interface UserWithSelection extends User {
  selected: boolean;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  visible,
  groupId,
  existingMemberIds,
  onCancel,
  onSuccess
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState<UserWithSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [searching, setSearching] = useState(false);

  // 搜索用户
  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setUsers([]);
      return;
    }

    try {
      setSearching(true);
      const searchResults = await groupService.searchUsers(keyword);
      
      // 过滤掉已经是群成员的用户
      const filteredUsers = searchResults
        .filter(user => !existingMemberIds.includes(user.id))
        .map(user => ({ ...user, selected: false }));
      
      setUsers(filteredUsers);
    } catch (error) {
      message.error('搜索用户失败');
    } finally {
      setSearching(false);
    }
  };

  // 选择/取消选择用户
  const handleUserSelect = (userId: string, selected: boolean) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, selected } : user
      )
    );
  };

  // 全选/取消全选
  const handleSelectAll = (selected: boolean) => {
    setUsers(prev => prev.map(user => ({ ...user, selected })));
  };

  // 邀请选中的用户
  const handleInvite = async () => {
    const selectedUsers = users.filter(user => user.selected);
    
    if (selectedUsers.length === 0) {
      message.warning('请选择要邀请的用户');
      return;
    }

    try {
      setInviting(true);
      await groupService.inviteMembers({
        groupId,
        userIds: selectedUsers.map(user => user.id)
      });
      
      message.success(`成功邀请 ${selectedUsers.length} 个用户`);
      onSuccess();
      handleCancel();
    } catch (error) {
      message.error('邀请用户失败');
    } finally {
      setInviting(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    setUsers([]);
    setSearchKeyword('');
    onCancel();
  };

  // 获取选中用户数量
  const selectedCount = users.filter(user => user.selected).length;
  const totalCount = users.length;

  return (
    <Modal
      title="邀请成员"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="invite" 
          type="primary" 
          loading={inviting}
          disabled={selectedCount === 0}
          onClick={handleInvite}
        >
          邀请 ({selectedCount})
        </Button>
      ]}
      width={600}
      destroyOnClose
    >
      <div className="space-y-4">
        {/* 搜索框 */}
        <Search
          placeholder="搜索用户名或邮箱"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={handleSearch}
          loading={searching}
          enterButton={<SearchOutlined />}
        />

        {/* 用户列表 */}
        <div className="max-h-96 overflow-auto">
          {users.length > 0 ? (
            <>
              {/* 全选按钮 */}
              <div className="mb-2 p-2 bg-gray-50 rounded">
                <Checkbox
                  checked={totalCount > 0 && selectedCount === totalCount}
                  indeterminate={selectedCount > 0 && selectedCount < totalCount}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  全选 ({selectedCount}/{totalCount})
                </Checkbox>
              </div>

              <List
                itemLayout="horizontal"
                dataSource={users}
                renderItem={user => (
                  <List.Item
                    style={{ padding: '8px 0' }}
                    actions={[
                      <Checkbox
                        key="select"
                        checked={user.selected}
                        onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={user.avatar}
                          icon={<UserOutlined />} 
                        />
                      }
                      title={
                        <div className="flex items-center space-x-2">
                          <Text strong>{user.username}</Text>
                          {user.online && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary">{user.email}</Text>
                          {user.signature && (
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {user.signature}
                              </Text>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          ) : (
            <Empty 
              description={
                searchKeyword ? 
                  "未找到匹配的用户" : 
                  "请输入关键词搜索用户"
              }
            />
          )}
        </div>

        {/* 提示信息 */}
        {selectedCount > 0 && (
          <div className="p-3 bg-blue-50 rounded">
            <Text type="secondary">
              已选择 {selectedCount} 个用户，点击"邀请"按钮发送邀请
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InviteMembersModal; 