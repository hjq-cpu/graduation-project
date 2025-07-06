# 个性签名功能测试指南

## 功能概述
个性签名功能允许用户设置和显示个人签名，在多个界面中展示用户的个性化信息。

## 已实现的功能

### 后端功能
1. **用户模型更新** - 在 `User.js` 中添加了 `signature` 字段
2. **API接口** - 添加了获取和更新用户信息的接口
3. **认证中间件** - 实现了JWT认证
4. **用户搜索** - 支持按用户名和邮箱搜索用户

### 前端功能
1. **设置页面** - 在设置页面可以编辑个性签名
2. **用户信息展示组件** - 创建了 `UserProfile` 组件
3. **联系人列表** - 显示联系人的个性签名
4. **群组成员列表** - 显示群组成员的个性签名
5. **聊天页面** - 在聊天头部显示对方的个性签名
6. **邀请成员模态框** - 显示候选用户的个性签名

## 测试步骤

### 1. 启动服务
```bash
# 启动后端服务
cd server
npm start

# 启动前端服务
cd client
npm start
```

### 2. 注册/登录用户
- 访问 http://localhost:3000
- 注册新用户或登录现有用户

### 3. 设置个性签名
- 点击"设置"菜单
- 在"账户信息"标签页中找到"个性签名"字段
- 输入个性签名（最多100字符）
- 点击"保存更改"

### 4. 查看个性签名显示
- **首页** - 查看个人信息卡片中的个性签名
- **聊天页面** - 选择联系人后查看聊天头部的个性签名
- **联系人列表** - 查看联系人列表中的个性签名
- **群组管理** - 查看群组成员列表中的个性签名

### 5. 测试用户搜索
- 在群组管理中点击"邀请成员"
- 搜索用户时可以看到用户的个性签名

## API接口

### 获取用户信息
```
GET /users/profile
Authorization: Bearer <token>
```

### 更新用户信息
```
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "新昵称",
  "signature": "新的个性签名",
  "status": "online"
}
```

### 搜索用户
```
GET /users/search?search=关键词
Authorization: Bearer <token>
```

## 组件使用示例

### UserProfile组件
```tsx
import UserProfile from '../components/UserProfile';

<UserProfile 
  user={user}
  showSignature={true}
  showStatus={true}
  size="default"
  layout="horizontal"
/>
```

### 在设置页面中使用
```tsx
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
```

## 注意事项

1. 个性签名最大长度为100字符
2. 个性签名为可选字段，可以为空
3. 在用户列表中，如果用户没有设置个性签名，则不显示该字段
4. 个性签名支持实时更新，修改后立即生效
5. 个性签名在搜索用户时也会显示，帮助用户识别

## 扩展功能建议

1. **签名模板** - 提供一些预设的个性签名模板
2. **表情支持** - 支持在个性签名中使用表情符号
3. **签名历史** - 保存用户的历史个性签名
4. **签名统计** - 统计用户个性签名的更新频率
5. **签名推荐** - 根据用户行为推荐合适的个性签名 