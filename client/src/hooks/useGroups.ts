import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Group, CreateGroupData, GroupSearchParams } from '../types/group';
import { groupService } from '../services/group';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取群组列表
  const fetchGroups = useCallback(async (params?: GroupSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const groupsData = await groupService.getGroups(params);
      setGroups(groupsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取群组列表失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建群组
  const createGroup = useCallback(async (data: CreateGroupData): Promise<Group | null> => {
    try {
      setLoading(true);
      setError(null);
      const newGroup = await groupService.createGroup(data);
      setGroups(prev => [newGroup, ...prev]);
      message.success('群组创建成功');
      return newGroup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建群组失败';
      setError(errorMessage);
      message.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新群组
  const updateGroup = useCallback(async (groupId: string, data: any): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await groupService.updateGroup(groupId, data);
      setGroups(prev => 
        prev.map(group => 
          group.id === groupId ? updatedGroup : group
        )
      );
      message.success('群组信息更新成功');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新群组失败';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除群组
  const deleteGroup = useCallback(async (groupId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await groupService.deleteGroup(groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
      message.success('群组删除成功');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除群组失败';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 退出群组
  const leaveGroup = useCallback(async (groupId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await groupService.leaveGroup(groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
      message.success('已退出群组');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '退出群组失败';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 加入群组
  const joinGroup = useCallback(async (inviteCode: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const newGroup = await groupService.joinByInviteCode(inviteCode);
      setGroups(prev => [newGroup, ...prev]);
      message.success('成功加入群组');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加入群组失败';
      setError(errorMessage);
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 根据ID获取群组
  const getGroupById = useCallback((groupId: string): Group | undefined => {
    return groups.find(group => group.id === groupId);
  }, [groups]);

  // 搜索群组
  const searchGroups = useCallback((keyword: string) => {
    return groups.filter(group =>
      group.name.toLowerCase().includes(keyword.toLowerCase()) ||
      group.description?.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [groups]);

  // 初始化时获取群组列表
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup,
    joinGroup,
    getGroupById,
    searchGroups
  };
}; 