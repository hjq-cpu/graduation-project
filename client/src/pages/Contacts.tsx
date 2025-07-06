import React, { useEffect, useState } from 'react';
import { Layout, Card, List, Avatar, Button, Input, Modal, Form, Badge, Typography } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { friendsService } from '../services/friends';

const { Content } = Layout;
const { Search } = Input;
const { Text } = Typography;

interface Contact {
  id: number;
  name: string;
  email: string;
  online: boolean;
  lastSeen?: Date;
}

export const Contacts: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  // 模拟的联系人数据
  const [contacts] = useState<Contact[]>([
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      online: true,
      lastSeen: new Date()
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      online: false,
      lastSeen: new Date(Date.now() - 3600000)
    }
  ]);

  const handleAddContact = async (values: any) => {
    // 这里添加新联系人的逻辑
    console.log('New contact:', values);
    setIsModalVisible(false);
    form.resetFields();
  };
  // 获取好友列表
  const fetchFriends = async () => {
    const response = await friendsService.getFriends();
    console.log(response);
  };
  // 获取好友请求
  const fetchFriendRequests = async () => {
    const response = await friendsService.getFriendRequests();
    console.log(response);
  };
  // 接受好友请求 
  const acceptFriendRequest = async (friendId: string) => {
    const response = await friendsService.acceptFriendRequest(friendId);
    console.log(response);
  };
  // 拒绝好友请求
  const rejectFriendRequest = async (friendId: string) => {
    const response = await friendsService.rejectFriendRequest(friendId);  
    console.log(response);
  };
  // 删除好友
  const deleteFriend = async (friendId: string) => {
    const response = await friendsService.removeFriend(friendId);
    console.log(response);
  };

  useEffect(() => {
    fetchFriends();
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
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              添加联系人
            </Button>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={contact => (
              <List.Item
                actions={[
                  <Button key="message" type="link">
                    发送消息
                  </Button>,
                  <Button key="delete" type="link" danger>
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
        </Card>

        <Modal
          title="添加联系人"
          open={isModalVisible}
          onOk={form.submit}
          onCancel={() => setIsModalVisible(false)}
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