import React from 'react';
import { List, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <List
      className="flex-1 overflow-auto px-4"
      itemLayout="horizontal"
      dataSource={messages}
      renderItem={message => (
        <List.Item style={{
          flexDirection: message.isMe ? 'row-reverse' : 'row',
          padding: '8px 0'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: message.isMe ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            maxWidth: '70%'
          }}>
            <Avatar 
              icon={<UserOutlined />}
              style={{ margin: message.isMe ? '0 0 0 12px' : '0 12px 0 0' }}
            />
            <div>
              <div style={{
                background: message.isMe ? '#1890ff' : '#f0f0f0',
                color: message.isMe ? '#fff' : 'inherit',
                padding: '8px 12px',
                borderRadius: '12px',
                maxWidth: '100%',
                wordWrap: 'break-word'
              }}>
                {message.content}
              </div>
              <Text type="secondary" style={{
                fontSize: '12px',
                marginTop: '4px',
                display: 'block',
                textAlign: message.isMe ? 'right' : 'left'
              }}>
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default MessageList; 