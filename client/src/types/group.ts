import { User } from './auth';

export enum GroupRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface GroupMember {
  id: string;
  user: User;
  role: GroupRole;
  joinTime: string;
  nickname?: string;
  isOnline: boolean;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  owner: User;
  members: GroupMember[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  inviteCode?: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  memberIds: string[];
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  avatar?: string;
  isPrivate?: boolean;
}

export interface GroupInviteData {
  groupId: string;
  userIds: string[];
}

export interface GroupMemberUpdateData {
  memberId: string;
  role?: GroupRole;
  nickname?: string;
}

export interface GroupSearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
} 