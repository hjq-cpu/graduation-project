import { 
  Group, 
  CreateGroupData, 
  UpdateGroupData, 
  GroupInviteData, 
  GroupMemberUpdateData,
  GroupSearchParams 
} from '../types/group';
import { User } from '../types/auth';
import config from "./base";
const API_BASE_URL = config.baseUrl;

class GroupService {
  // 创建群组
  async createGroup(data: CreateGroupData): Promise<Group> {
    const response = await config.request.post(`${API_BASE_URL}/groups`, data);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('创建群组失败');
    }

    return response.data;
  }

  // 获取群组列表
  async getGroups(params?: GroupSearchParams): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await config.request.get(`${API_BASE_URL}/groups?${queryParams}`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      return response.statusText; // 返回错误信息
    }

    return response.data;
  }

  // 获取群组详情
  async getGroup(groupId: string): Promise<Group> {
    const response = await config.request.get(`${API_BASE_URL}/groups/${groupId}`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('获取群组详情失败');
    }

    return response.data;
  }

  // 更新群组信息
  async updateGroup(groupId: string, data: UpdateGroupData): Promise<Group> {
    const response = await config.request.put(`${API_BASE_URL}/groups/${groupId}`, data);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('更新群组信息失败');
    }

    return response.data;
  }

  // 删除群组
  async deleteGroup(groupId: string): Promise<void> {
    const response = await config.request.delete(`${API_BASE_URL}/groups/${groupId}`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('删除群组失败');
    }
  }

  // 邀请用户加入群组
  async inviteMembers(data: GroupInviteData): Promise<void> {
    const response = await config.request.post(`${API_BASE_URL}/groups/${data.groupId}/invite`, { userIds: data.userIds });

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('邀请用户失败');
    }
  }

  // 移除群成员
  async removeMember(groupId: string, memberId: string): Promise<void> {
    const response = await config.request.delete(`${API_BASE_URL}/groups/${groupId}/members/${memberId}`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('移除成员失败');
    }
  }

  // 更新成员角色
  async updateMemberRole(groupId: string, data: GroupMemberUpdateData): Promise<void> {
    const response = await config.request.put(`${API_BASE_URL}/groups/${groupId}/members/${data.memberId}/role`, { role: data.role });

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('更新成员角色失败');
    }
  }

  // 更新成员昵称
  async updateMemberNickname(groupId: string, data: GroupMemberUpdateData): Promise<void> {
    const response = await config.request.put(`${API_BASE_URL}/groups/${groupId}/members/${data.memberId}/nickname`, { nickname: data.nickname });

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('更新成员昵称失败');
    }
  }

  // 退出群组
  async leaveGroup(groupId: string): Promise<void> {
    const response = await config.request.post(`${API_BASE_URL}/groups/${groupId}/leave`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('退出群组失败');
    }
  }

  // 搜索用户（用于邀请）
  async searchUsers(keyword: string): Promise<User[]> {
    const response = await config.request.get(`${API_BASE_URL}/users/search?keyword=${encodeURIComponent(keyword)}`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('搜索用户失败');
    }

    return response.data;
  }

  // 获取群组邀请码
  async getInviteCode(groupId: string): Promise<{ inviteCode: string }> {
    const response = await config.request.get(`${API_BASE_URL}/groups/${groupId}/invite-code`);

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('获取邀请码失败');
    }

    return response.data;
  }

  // 通过邀请码加入群组
  async joinByInviteCode(inviteCode: string): Promise<Group> {
    const response = await config.request.post(`${API_BASE_URL}/groups/join`, { inviteCode });

    if (response.status !== config.request.HttpStatusCode.Ok) {
      throw new Error('加入群组失败');
    }

    return response.data;
  }
}

export const groupService = new GroupService(); 