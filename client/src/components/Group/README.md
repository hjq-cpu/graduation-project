# 群成员管理功能

## 功能概述

群成员管理功能提供了完整的群组管理解决方案，包括群组创建、成员管理、权限控制等功能。

## 主要组件

### 1. GroupMemberList (群成员列表)
- 显示群组所有成员信息
- 支持搜索成员
- 角色管理（群主、管理员、成员）
- 成员操作（移除、角色变更）
- 在线状态显示
- 邀请码复制功能

### 2. InviteMembersModal (邀请成员模态框)
- 搜索用户功能
- 批量选择用户
- 邀请用户加入群组
- 过滤已存在的成员

### 3. GroupManagement (群组管理页面)
- 群组信息展示
- 成员管理标签页
- 群组设置标签页
- 退出/删除群组功能

### 4. Groups (群组列表页面)
- 显示用户加入的群组
- 创建新群组
- 通过邀请码加入群组
- 搜索群组功能

## 权限系统

### 角色定义
- **群主 (OWNER)**: 拥有所有权限，可以管理所有成员
- **管理员 (ADMIN)**: 可以管理普通成员，但不能管理其他管理员
- **成员 (MEMBER)**: 普通成员，只能查看信息

### 权限矩阵

| 操作 | 群主 | 管理员 | 成员 |
|------|------|--------|------|
| 查看成员列表 | ✅ | ✅ | ✅ |
| 邀请新成员 | ✅ | ✅ | ❌ |
| 移除成员 | ✅ | ✅ (仅普通成员) | ❌ |
| 设置管理员 | ✅ | ❌ | ❌ |
| 取消管理员 | ✅ | ❌ | ❌ |
| 删除群组 | ✅ | ❌ | ❌ |
| 退出群组 | ✅ | ✅ | ✅ |

## API 接口

### 群组管理
- `GET /api/groups` - 获取群组列表
- `POST /api/groups` - 创建群组
- `GET /api/groups/:id` - 获取群组详情
- `PUT /api/groups/:id` - 更新群组信息
- `DELETE /api/groups/:id` - 删除群组

### 成员管理
- `POST /api/groups/:id/invite` - 邀请成员
- `DELETE /api/groups/:id/members/:memberId` - 移除成员
- `PUT /api/groups/:id/members/:memberId/role` - 更新成员角色
- `PUT /api/groups/:id/members/:memberId/nickname` - 更新成员昵称

### 邀请码
- `GET /api/groups/:id/invite-code` - 获取邀请码
- `POST /api/groups/join` - 通过邀请码加入群组

## 使用方法

### 1. 创建群组
```typescript
import { useGroups } from '../hooks/useGroups';

const { createGroup } = useGroups();

const handleCreate = async () => {
  const newGroup = await createGroup({
    name: '我的群组',
    description: '群组描述',
    isPrivate: false,
    memberIds: []
  });
};
```

### 2. 邀请成员
```typescript
import { useGroupMembers } from '../hooks/useGroupMembers';

const { inviteMembers } = useGroupMembers(groupId);

const handleInvite = async () => {
  const success = await inviteMembers(['user1', 'user2']);
  if (success) {
    // 刷新成员列表
  }
};
```

### 3. 管理成员
```typescript
const { removeMember, updateMemberRole } = useGroupMembers(groupId);

// 移除成员
await removeMember(memberId);

// 更新角色
await updateMemberRole(memberId, GroupRole.ADMIN);
```

## 自定义Hook

### useGroups
提供群组相关的状态管理和操作：
- `groups`: 群组列表
- `loading`: 加载状态
- `createGroup`: 创建群组
- `updateGroup`: 更新群组
- `deleteGroup`: 删除群组
- `leaveGroup`: 退出群组
- `joinGroup`: 加入群组

### useGroupMembers
提供群组成员管理功能：
- `inviteMembers`: 邀请成员
- `removeMember`: 移除成员
- `updateMemberRole`: 更新角色
- `updateMemberNickname`: 更新昵称
- `getInviteCode`: 获取邀请码
- `searchUsers`: 搜索用户

## 样式定制

组件使用了 Ant Design 和 Tailwind CSS，可以通过以下方式定制样式：

```css
/* 自定义群成员列表样式 */
.group-member-list {
  @apply bg-white rounded-lg shadow-sm;
}

/* 自定义角色标签样式 */
.role-tag-owner {
  @apply bg-yellow-100 text-yellow-800;
}

.role-tag-admin {
  @apply bg-blue-100 text-blue-800;
}
```

## 注意事项

1. 确保后端API接口已正确实现
2. 权限检查在前端和后端都要进行
3. 敏感操作需要二次确认
4. 实时更新成员状态（在线/离线）
5. 处理网络错误和异常情况
6. 保护用户隐私数据

## 扩展功能

可以考虑添加以下功能：
- 群组公告管理
- 群组文件共享
- 群组投票功能
- 群组活动管理
- 群组数据统计
- 群组消息搜索 