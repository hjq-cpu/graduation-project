import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined, SmileOutlined, PaperClipOutlined } from '@ant-design/icons';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend
}) => {
  return (
    <div className="flex items-center gap-2 p-4 border-t">
      <Button icon={<SmileOutlined />} />
      <Button icon={<PaperClipOutlined />} />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        onPressEnter={onSend}
        placeholder="输入消息..."
        suffix={
          <SendOutlined 
            onClick={onSend}
            style={{ 
              cursor: 'pointer', 
              color: value.trim() ? '#1890ff' : '#d9d9d9' 
            }}
          />
        }
      />
    </div>
  );
};

export default MessageInput; 