import React, { useState } from 'react';
import { Layout, Typography, Avatar, Badge, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ContactList, { Contact } from '../components/Chat/ContactList';
import MessageList, { Message } from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import UserProfile from '../components/UserProfile';
import { User } from '../types/auth';

const { Content, Sider } = Layout;
const { Text } = Typography;

export const Chat: React.FC = () => {
  const [messageInput, setMessageInput] = useState('');
  const [selectedContact, setSelectedContact] = useState<User | null>(null);

  // 模拟的消息数据
  const [messages] = useState<Message[]>([
    {
      id: 1,
      content: '你好！最近怎么样？',
      sender: '张三',
      timestamp: new Date(),
      isMe: false
    },
    {
      id: 2,
      content: '我很好，谢谢关心！',
      sender: '我',
      timestamp: new Date(),
      isMe: true
    }
  ]);

  // 模拟的联系人数据
  const [contacts] = useState<User[]>([
    {
      id: "1",
      username: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://example.com/avatar1.jpg',
      status: 'online',
      signature: '生活就像一盒巧克力，你永远不知道下一颗是什么味道',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 1,
      online: true
    },
    {
      id: "2",
      username: '李四',
      email: 'lisi@example.com',
      avatar: 'https://example.com/avatar2.jpg',
      status: 'offline',
      signature: '晚上一起吃饭吗？',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
      online: false
    }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // 这里添加发送消息的逻辑
    setMessageInput('');
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <ContactList
          contacts={contacts}
          selectedId={selectedContact?.id}
          onSelect={setSelectedContact}
        />
      </Sider>
      <Content style={{ 
        display: 'flex', 
        flexDirection: 'column',
        background: '#fff' 
      }}>
        {selectedContact ? (
          <>
            {/* 聊天头部 */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              background: '#fafafa'
            }}>
              <UserProfile 
                user={selectedContact}
                size="default"
                layout="horizontal"
              />
            </div>
            <MessageList messages={messages} />
            <MessageInput
              value={messageInput}
              onChange={setMessageInput}
              onSend={handleSendMessage}
            />
          </>
        ) : (
          <div style={{ 
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#999'
          }}>
            请选择一个联系人开始聊天
          </div>
        )}
      </Content>
    </Layout>
  );
}; 