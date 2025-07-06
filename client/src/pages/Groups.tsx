import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Button, 
  Input, 
  Modal, 
  Form, 
  message, 
  Spin,
  Typography,
  Space,
  Tag,
  Avatar,
  Empty,
  Row,
  Col,
  Radio
} from 'antd';
import { 
  TeamOutlined, 
  PlusOutlined, 
  UsergroupAddOutlined,
  SearchOutlined,
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Group, CreateGroupData } from '../types/group';
import { groupService } from '../services/group';
import { useAuth } from '../hooks/useAuth';

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [creating, setCreating] = useState(false);

  // 获取群组列表
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await groupService.getGroups();
      setGroups(groupsData);
    } catch (error) {
      message.error('获取群组列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索群组
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  // 过滤群组
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 创建群组
  const handleCreateGroup = async (values: any) => {
    try {
      setCreating(true);
      const groupData: CreateGroupData = {
        name: values.name,
        description: values.description,
        isPrivate: values.isPrivate,
        memberIds: values.memberIds || []
      };
      
      const newGroup = await groupService.createGroup(groupData);
      message.success('群组创建成功');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchGroups();
      
      navigate(`/groups/${newGroup.id}/management`);
    } catch (error) {
      message.error('创建群组失败');
    } finally {
      setCreating(false);
    }
  };

  // 加入群组（通过邀请码）
  const handleJoinGroup = () => {
    let inviteCode = '';
    Modal.confirm({
      title: '加入一个群组',
      icon: <UsergroupAddOutlined />,
      content: (
        <Input 
          placeholder="请输入群组邀请码" 
          onChange={(e) => (inviteCode = e.target.value)}
        />
      ),
      okText: '立即加入',
      cancelText: '取消',
      onOk: async () => {
        if (!inviteCode.trim()) {
          message.warning('请输入邀请码');
          return Promise.reject();
        }
        try {
          await groupService.joinByInviteCode(inviteCode);
          message.success('成功加入群组');
          fetchGroups();
        } catch (error) {
          message.error('加入群组失败，请检查邀请码是否正确');
          return Promise.reject();
        }
      }
    });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50">
      <Card bordered={false} bodyStyle={{ padding: '24px' }}>
        {/* 页面头部 */}
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col>
            <Title level={2} className="!mb-0">
              我的群组
            </Title>
          </Col>
          <Col>
            <Space size="middle">
              <Button 
                icon={<UsergroupAddOutlined />}
                onClick={handleJoinGroup}
              >
                加入群组
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                创建群组
              </Button>
            </Space>
          </Col>
        </Row>
        
        <div className="mt-6 mb-2">
          <Search
            placeholder="搜索群组名称或描述"
            onSearch={handleSearch}
            enterButton
            size="large"
          />
        </div>

        {/* 群组列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <List
            className="mt-6"
            grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={filteredGroups}
            renderItem={group => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => navigate(`/groups/${group.id}/management`)}
                  className="group-card"
                  bodyStyle={{ padding: 20 }}
                >
                  <div className="flex items-center mb-3">
                    <Avatar 
                      size={50}
                      src={group.avatar}
                      icon={<TeamOutlined />}
                      className="bg-blue-100 text-blue-500"
                    />
                    <div className="ml-4 min-w-0">
                      <Text strong className="truncate block text-base">
                        {group.name}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {group.isPrivate ? (
                          <>
                            <LockOutlined className="mr-1" />
                            私密群组
                          </>
                        ) : (
                          <>
                            <GlobalOutlined className="mr-1" />
                            公开群组
                          </>
                        )}
                      </Text>
                    </div>
                  </div>
                  
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="h-10 text-sm">
                    {group.description || '暂无群组描述'}
                  </Paragraph>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t">
                    <span>
                      <UserOutlined className="mr-1" />
                      {group.memberCount} 人
                    </span>
                    <span>
                      创建于 {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-20">
            <Empty
              image={<InboxOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
              description={
                <div className="mt-4">
                  <Title level={4}>
                    {searchKeyword ? "未找到匹配的群组" : "你还没有加入任何群组"}
                  </Title>
                  <Text type="secondary">
                    创建一个属于你的群组，或者通过邀请码加入一个
                  </Text>
                </div>
              }
            >
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                创建第一个群组
              </Button>
            </Empty>
          </div>
        )}
      </Card>

      {/* 创建群组模态框 */}
      <Modal
        title={
          <div className="flex items-center">
            <TeamOutlined className="mr-2 text-xl" />
            <span className="text-xl">创建新群组</span>
          </div>
        }
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={520}
        destroyOnClose
        centered
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateGroup}
          className="mt-6"
        >
          <Form.Item
            name="name"
            label="群组名称"
            rules={[
              { required: true, message: '请输入群组名称' },
              { min: 2, max: 20, message: '群组名称长度为2-20个字符' }
            ]}
          >
            <Input placeholder="例如：技术交流分享群" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="群组描述"
            rules={[
              { max: 100, message: '群组描述不能超过100个字符' }
            ]}
          >
            <Input.TextArea 
              placeholder="介绍一下你的群组是做什么的（可选）" 
              rows={3}
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="isPrivate"
            label="群组类型"
            initialValue={false}
          >
            <Radio.Group buttonStyle="solid" size="large">
              <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
                <GlobalOutlined className="mr-2" />
                公开
              </Radio.Button>
              <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
                <LockOutlined className="mr-2" />
                私密
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Row gutter={16} justify="end">
              <Col>
                <Button 
                  size="large"
                  onClick={() => setCreateModalVisible(false)}
                >
                  取消
                </Button>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={creating}
                  size="large"
                >
                  确认创建
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Groups; 