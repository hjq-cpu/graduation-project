import React, { useEffect, useState } from 'react';
import { Layout, Card, List, Avatar, Button, Input, Modal, Form, Badge, Typography, Empty, Tabs, Space } from 'antd';
import { UserOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { friendsService } from '../services/friends';
import { message } from 'antd';

const { Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

interface Contact {
  id: number;
  name: string;
  email: string;
  online: boolean;
  lastSeen?: Date;
}

interface FriendRequest {
  id: string;
  requesterId: string;
  requesterNickname?: string;
  requesterAvatar?: string;
  requesterEmail: string;
  requestMessage?: string;
  createdAt: string;
}

message.config({
  top: 100,
});

export const Contacts: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 联系人数据
  const [contacts, setContacts] = useState<Contact[]>([]);
  // 好友申请数据
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const handleAddContact = async (values: any) => {
      setLoading(true);
      const response = await friendsService.addFriend(values.email);
      if (response.success) {
        message.success('好友请求发送成功');
        setIsModalVisible(false);
        form.resetFields();
        // 刷新好友申请列表
        fetchFriendRequests();
      } else {
        message.error(response.message || '添加好友失败');
      }
      setLoading(false);
  };

  // 获取好友列表
  const fetchFriends = async () => {
      const response = await friendsService.getFriends();
      if (response.success) {
        setContacts(response.data.friends || []);
      }
  };

  // 获取好友请求
  const fetchFriendRequests = async () => {
    try {
      const response = await friendsService.getFriendRequests();
      console.log('好友请求响应:', response);
      
      if (response.success) {
        console.log('好友请求数据:', response.data);
        setFriendRequests(response.data.requests || []);
      } else {
        console.error('获取好友请求失败:', response.message);
        message.error(response.message || '获取好友请求失败');
      }
    } catch (error) {
      console.error('获取好友请求异常:', error);
      message.error('获取好友请求失败');
    }
  };

  // 接受好友请求 
  const acceptFriendRequest = async (contactId: string) => {
    const response = await friendsService.acceptFriendRequest(contactId);
    if (response.success) {
      message.success('已接受好友请求');
      // 刷新列表
      fetchFriendRequests();
      fetchFriends();
    } else {
      message.error(response.message || '接受好友请求失败');
    }
  };

  // 拒绝好友请求
  const rejectFriendRequest = async (contactId: string) => {
    const response = await friendsService.rejectFriendRequest(contactId);
    if (response.success) {
      message.success('已拒绝好友请求');
      // 刷新列表
      fetchFriendRequests();
    } else {
      message.error(response.message || '拒绝好友请求失败');
    }
  };

  // 删除好友
  const deleteFriend = async (friendId: string) => {
    const response = await friendsService.removeFriend(friendId);
    if (response.success) {
      message.success('已删除好友');
      // 刷新好友列表
      fetchFriends();
    } else {
      message.error(response.message || '删除好友失败');
    }
  };

  const handleSendMessage = (contactId: string) => {
    console.log(contactId);
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  return (
    <Layout style={{ height: '100%' }}>
      <Content>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Search
              placeholder="搜索联系人"
              style={{ width: 300 }}
            />
            <Button
              style={{ marginLeft: '20px' }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              添加联系人
            </Button>
          </div>

          <Tabs defaultActiveKey="friends">
            <TabPane tab="好友列表" key="friends">
              <List
                dataSource={contacts}
                locale={{
                  emptyText: <div>
                    <Empty description="暂无好友" />
                  </div>
                }}
                renderItem={contact => (
                  <List.Item
                    actions={[
                      <Button key="message" type="link" onClick={() => handleSendMessage(contact.id.toString())}>
                        发送消息
                      </Button>,
                      <Button
                        key="delete"
                        type="link"
                        danger
                        onClick={() => deleteFriend(contact.id.toString())}
                      >
                        删除
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={contact.online} color="green">
                          <Avatar icon={<UserOutlined />} />
                        </Badge>
                      }
                      title={<Text strong>{contact.name}</Text>}
                      description={
                        <div>
                          <div>{contact.email}</div>
                          <Text type="secondary">
                            {contact.online
                              ? '在线'
                              : `最后在线: ${contact.lastSeen?.toLocaleString()}`
                            }
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane tab="好友申请" key="requests">
              <List
                dataSource={friendRequests}
                locale={{
                  emptyText: <div>
                    <Empty description="暂无好友申请" />
                  </div>
                }}
                renderItem={request => {
                  // 防护性检查
                  if (!request || !request.requesterEmail) {
                    console.warn('无效的好友申请数据:', request);
                    return null;
                  }
                  
                  return (
                    <List.Item
                      actions={[
                        <Button
                          key="accept"
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => acceptFriendRequest(request.id)}
                        >
                          接受
                        </Button>,
                        <Button
                          key="reject"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => rejectFriendRequest(request.id)}
                        >
                          拒绝
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <Text strong>
                            {request.requesterNickname || request.requesterEmail}
                          </Text>
                        }
                        description={
                          <div>
                            <div>{request.requesterEmail}</div>
                            {request.requestMessage && (
                              <Text type="secondary">
                                申请消息: {request.requestMessage}
                              </Text>
                            )}
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {new Date(request.createdAt).toLocaleString()}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title="添加联系人"
          open={isModalVisible}
          onOk={form.submit}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={loading}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddContact}
          >
            <Form.Item
              name="email"
              label="邮箱地址"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入联系人的邮箱地址" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}; 