import { useState, useCallback } from 'react';
import { message } from 'antd';
import { GroupMember, GroupRole, GroupMemberUpdateData } from '../types/group';
import { groupService } from '../services/group';

export const useGroupMembers = (groupId: string) => {
  const [loading, setLoading] = useState(false);

  // 邀请成员
  const inviteMembers = useCallback(async (userIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      await groupService.inviteMembers({ groupId, userIds });
      message.success(`成功邀请 ${userIds.length} 个用户`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '邀请用户失败';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 移除成员
  const removeMember = useCallback(async (memberId: string): Promise<boolean> => {
    try {
      setLoading(true);
      await groupService.removeMember(groupId, memberId);
      message.success('成员移除成功');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '移除成员失败';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 更新成员角色
  const updateMemberRole = useCallback(async (memberId: string, role: GroupRole): Promise<boolean> => {
    try {
      setLoading(true);
      await groupService.updateMemberRole(groupId, { memberId, role });
      message.success('角色更新成功');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '角色更新失败';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 更新成员昵称
  const updateMemberNickname = useCallback(async (memberId: string, nickname: string): Promise<boolean> => {
    try {
      setLoading(true);
      await groupService.updateMemberNickname(groupId, { memberId, nickname });
      message.success('昵称更新成功');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '昵称更新失败';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 获取邀请码
  const getInviteCode = useCallback(async (): Promise<string | null> => {
    try {
      setLoading(true);
      const { inviteCode } = await groupService.getInviteCode(groupId);
      return inviteCode;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取邀请码失败';
      message.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 搜索用户（用于邀请）
  const searchUsers = useCallback(async (keyword: string) => {
    try {
      setLoading(true);
      const users = await groupService.searchUsers(keyword);
      return users;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '搜索用户失败';
      message.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 检查权限
  const checkPermission = useCallback((
    currentUserRole: GroupRole,
    targetUserRole: GroupRole,
    currentUserId: string,
    targetUserId: string
  ): boolean => {
    // 不能操作自己
    if (currentUserId === targetUserId) return false;
    
    // 群主可以操作所有人
    if (currentUserRole === GroupRole.OWNER) return true;
    
    // 管理员只能操作普通成员
    if (currentUserRole === GroupRole.ADMIN && targetUserRole === GroupRole.MEMBER) return true;
    
    return false;
  }, []);

  // 获取角色显示名称
  const getRoleDisplayName = useCallback((role: GroupRole): string => {
    switch (role) {
      case GroupRole.OWNER:
        return '群主';
      case GroupRole.ADMIN:
        return '管理员';
      case GroupRole.MEMBER:
        return '成员';
      default:
        return '未知';
    }
  }, []);

  // 获取角色颜色
  const getRoleColor = useCallback((role: GroupRole): string => {
    switch (role) {
      case GroupRole.OWNER:
        return 'gold';
      case GroupRole.ADMIN:
        return 'blue';
      case GroupRole.MEMBER:
        return 'default';
      default:
        return 'default';
    }
  }, []);

  return {
    loading,
    inviteMembers,
    removeMember,
    updateMemberRole,
    updateMemberNickname,
    getInviteCode,
    searchUsers,
    checkPermission,
    getRoleDisplayName,
    getRoleColor
  };
}; 