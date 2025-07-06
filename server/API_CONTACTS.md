# 联系人 API 文档

## 概述
联系人API提供了完整的好友管理功能，包括发送好友请求、接受/拒绝请求、管理好友列表等。

## 基础信息
- 基础URL: `http://localhost:3001/contacts`
- 所有接口都需要在请求头中包含JWT token: `Authorization: Bearer <token>`
- 响应格式: JSON

## 接口列表

### 1. 发送好友请求
**POST** `/friend-request`

发送好友请求给指定用户。

**请求体:**
```json
{
  "recipientId": "用户ID",
  "requestMessage": "好友请求消息（可选）"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "好友请求发送成功",
  "data": {
    "id": "联系人关系ID",
    "status": "pending",
    "requestMessage": "你好，我想加你为好友",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 接受好友请求
**PUT** `/friend-request/:contactId/accept`

接受指定的好友请求。

**路径参数:**
- `contactId`: 联系人关系ID

**响应示例:**
```json
{
  "success": true,
  "message": "好友请求已接受",
  "data": {
    "id": "联系人关系ID",
    "status": "accepted",
    "lastInteraction": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. 拒绝好友请求
**PUT** `/friend-request/:contactId/reject`

拒绝指定的好友请求。

**路径参数:**
- `contactId`: 联系人关系ID

**请求体:**
```json
{
  "rejectReason": "拒绝原因（可选）"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "好友请求已拒绝",
  "data": {
    "id": "联系人关系ID",
    "status": "rejected",
    "rejectReason": "暂时不想添加好友"
  }
}
```

### 4. 获取好友列表
**GET** `/friends`

获取当前用户的好友列表。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "id": "联系人关系ID",
        "friendId": "好友用户ID",
        "nickname": "好友昵称",
        "avatar": "头像路径",
        "email": "邮箱",
        "status": "在线状态",
        "note": "备注名",
        "group": "分组",
        "pinned": false,
        "lastInteraction": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

### 5. 获取待处理的好友请求
**GET** `/pending-requests`

获取当前用户收到的待处理好友请求。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "联系人关系ID",
        "requesterId": "请求者用户ID",
        "requesterNickname": "请求者昵称",
        "requesterAvatar": "请求者头像",
        "requesterEmail": "请求者邮箱",
        "requestMessage": "请求消息",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

### 6. 更新好友备注
**PUT** `/friend/:contactId/note`

更新指定好友的备注名。

**路径参数:**
- `contactId`: 联系人关系ID

**请求体:**
```json
{
  "note": "新的备注名"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "备注更新成功",
  "data": {
    "id": "联系人关系ID",
    "note": "新备注名"
  }
}
```

### 7. 删除好友
**DELETE** `/friend/:contactId`

删除指定的好友关系。

**路径参数:**
- `contactId`: 联系人关系ID

**响应示例:**
```json
{
  "success": true,
  "message": "好友关系已删除"
}
```

## 错误响应

所有接口在发生错误时都会返回以下格式：

```json
{
  "success": false,
  "message": "错误描述信息"
}
```

### 常见HTTP状态码
- `400`: 请求参数错误
- `401`: 未授权（token无效或缺失）
- `403`: 禁止访问（权限不足）
- `404`: 资源不存在
- `500`: 服务器内部错误

## 使用示例

### JavaScript/TypeScript 示例

```javascript
// 发送好友请求
const sendFriendRequest = async (recipientId, message) => {
  const response = await fetch('/contacts/friend-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      recipientId,
      requestMessage: message
    })
  });
  return response.json();
};

// 获取好友列表
const getFriends = async () => {
  const response = await fetch('/contacts/friends', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// 接受好友请求
const acceptRequest = async (contactId) => {
  const response = await fetch(`/contacts/friend-request/${contactId}/accept`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## 注意事项

1. 所有请求都需要有效的JWT token
2. 用户不能给自己发送好友请求
3. 同一对用户之间只能存在一条好友关系记录
4. 好友列表按置顶状态和最后互动时间排序
5. 删除好友关系是双向的，删除后需要重新发送好友请求 