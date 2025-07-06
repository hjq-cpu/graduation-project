import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Typography,
  Form,
  Input,
  Button,
  Switch,
  Avatar,
  Upload,
  Space,
  Radio,
  message,
  Select,
} from 'antd';
import {
  UserOutlined,
  BellOutlined,
  BgColorsOutlined,
  LockOutlined,
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { authService } from '../services/auth';
import { User } from '../types/auth';

const { Title } = Typography;
// const { TabPane } = Tabs;
const { TextArea } = Input;

// Placeholder components for different settings panels

const AccountSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   loadUserProfile();
  // }, []);

  // const loadUserProfile = async () => {
  //   try {
  //     const response = await authService.getUserProfile();
  //     if (response.success) {
  //       setUser(response.data);
  //       form.setFieldsValue({
  //         username: response.data.username,
  //         signature: response.data.signature,
  //         status: response.data.status
  //       });
  //     }
  //   } catch (error) {
  //     message.error('加载用户信息失败');
  //   }
  // };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const response = await authService.updateUserProfile({
        nickname: values.username,
        signature: values.signature,
        status: values.status
      });
      
      if (response.success) {
        message.success('账户信息已保存');
        setUser(response.data);
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="账户信息" bordered={false}>
      <Form 
        form={form}
        layout="vertical" 
        style={{ maxWidth: 400 }}
        onFinish={handleSave}
      >
        <Form.Item label="头像">
          <Space align="center">
            <Avatar 
              size={64} 
              src={user?.avatar}
              icon={<UserOutlined />} 
            />
            <Upload>
              <Button icon={<UploadOutlined />}>更换头像</Button>
            </Upload>
          </Space>
        </Form.Item>
        
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="输入新的用户名" />
        </Form.Item>
        
        <Form.Item
          name="signature"
          label="个性签名"
        >
          <TextArea 
            placeholder="写点什么来表达自己吧..." 
            maxLength={100}
            showCount
            rows={3}
          />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="在线状态"
        >
          <Select placeholder="选择在线状态">
            <Select.Option value="online">在线</Select.Option>
            <Select.Option value="away">离开</Select.Option>
            <Select.Option value="busy">忙碌</Select.Option>
            <Select.Option value="offline">离线</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="邮箱">
          <Input type="email" value={user?.email} disabled />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            loading={loading}
            htmlType="submit"
          >
            保存更改
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const SecuritySettings = () => (
  <Card title="安全设置" bordered={false}>
    <Form layout="vertical" style={{ maxWidth: 400 }}>
      <Form.Item
        name="currentPassword"
        label="当前密码"
        rules={[{ required: true, message: '请输入当前密码' }]}
      >
        <Input.Password placeholder="输入当前密码" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[{ required: true, message: '请输入新密码' }]}
      >
        <Input.Password placeholder="输入新密码" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="确认新密码"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '请确认新密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不匹配!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="再次输入新密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('密码已修改')}>
          修改密码
        </Button>
      </Form.Item>
      <Form.Item label="两步验证 (2FA)" extra="为您的账户增加一层额外的安全保护。">
        <Switch />
      </Form.Item>
    </Form>
  </Card>
);

const NotificationSettings = () => (
  <Card title="通知设置" bordered={false}>
    <Form layout="vertical">
      <Form.Item label="桌面通知" extra="在您的电脑屏幕上显示新消息通知。">
        <Switch defaultChecked />
      </Form.Item>
      <Form.Item label="声音提醒" extra="收到新消息时播放提示音。">
        <Switch defaultChecked />
      </Form.Item>
      <Form.Item label="消息预览" extra="在通知中显示发信人和消息内容摘要。">
        <Switch />
      </Form.Item>
      <Form.Item label="消息免打扰" extra="在特定时段内关闭所有通知。">
        <Switch />
      </Form.Item>
    </Form>
  </Card>
);

const AppearanceSettings = () => (
  <Card title="外观设置" bordered={false}>
    <Form layout="vertical">
      <Form.Item label="主题模式">
        <Radio.Group defaultValue="light">
          <Radio value="light">明亮</Radio>
          <Radio value="dark">暗黑</Radio>
          <Radio value="system">跟随系统</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  </Card>
);

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
      <div className="flex items-center mb-8">
        <Button
          type="text"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="mr-4"
          size="large"
        />
        <Title level={2} className="!mb-0">
          设置
        </Title>
      </div>
      <Tabs
        tabPosition="left"
        defaultActiveKey="account"
        items={[
          {
            key: 'account',
            label: (
              <span className="flex items-center space-x-2">
                <UserOutlined />
                <span>账户</span>
              </span>
            ),
            children: <AccountSettings />,
          },
          {
            key: 'security',
            label: (
              <span className="flex items-center space-x-2">
                <LockOutlined />
                <span>安全</span>
              </span>
            ),
            children: <SecuritySettings />,
          },
          {
            key: 'notifications',
            label: (
              <span className="flex items-center space-x-2">
                <BellOutlined />
                <span>通知</span>
              </span>
            ),
            children: <NotificationSettings />,
          },
          {
            key: 'appearance',
            label: (
              <span className="flex items-center space-x-2">
                <BgColorsOutlined />
                <span>外观</span>
              </span>
            ),
            children: <AppearanceSettings />,
          },
        ]}
      />
    </div>
  );
};

export default Settings; 