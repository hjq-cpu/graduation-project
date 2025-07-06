import React from 'react';
import { List, Avatar, Badge, Input, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../../types/auth';

const { Search } = Input;
const { Text } = Typography;

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
  online: boolean;
}

interface ContactListProps {
  contacts: User[];
  selectedId?: string;
  onSelect: (contact: User) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedId,
  onSelect
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Search placeholder="搜索联系人" />
      </div>
      <List
        className="flex-1 overflow-auto"
        itemLayout="horizontal"
        dataSource={contacts}
        renderItem={contact => (
          <List.Item 
            onClick={() => onSelect(contact)}
            style={{ 
              padding: '12px 24px',
              cursor: 'pointer',
              backgroundColor: selectedId === contact.id ? '#f0f0f0' : 'transparent'
            }}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={contact.online} color="green">
                  <Avatar icon={<UserOutlined />} />
                </Badge>
              }
              title={
                <div className="flex items-center space-x-2">
                  <Text strong>{contact.username}</Text>
                </div>
              }
              description={
                contact.signature ? (
                  <Text type="secondary" ellipsis>
                    {contact.signature}
                  </Text>
                ) : null
              }
            />
            {contact.unreadCount > 0 && (
              <Badge count={contact.unreadCount} />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ContactList; 