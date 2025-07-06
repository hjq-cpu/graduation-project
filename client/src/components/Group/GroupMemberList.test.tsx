import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import GroupMemberList from './GroupMemberList';
import { GroupMember, GroupRole } from '../../types/group';

// Mock dependencies
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../../services/group', () => ({
  groupService: {
    removeMember: jest.fn(),
    updateMemberRole: jest.fn(),
    getInviteCode: jest.fn()
  }
}));

// Mock data
const mockMembers: GroupMember[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: '张三',
      email: 'zhangsan@example.com',
      avatar: '',
      status: 'online',
      online: true,
      unreadCount: 0,
      signature: '你好世界',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    role: GroupRole.OWNER,
    joinTime: '2024-01-01T00:00:00Z',
    nickname: '群主',
    isOnline: true
  },
  {
    id: '2',
    user: {
      id: 'user2',
      username: '李四',
      email: 'lisi@example.com',
      avatar: '',
      status: 'offline',
      online: false,
      unreadCount: 0,
      signature: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    role: GroupRole.MEMBER,
    joinTime: '2024-01-02T00:00:00Z',
    nickname: '',
    isOnline: false
  }
];

describe('GroupMemberList', () => {
  const defaultProps = {
    groupId: 'test-group',
    members: mockMembers,
    currentUserId: 'user1',
    currentUserRole: GroupRole.OWNER,
    onMemberUpdate: jest.fn(),
    onInviteMembers: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders member list correctly', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    expect(screen.getByText('群成员 (2)')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
  });

  it('shows role tags correctly', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    expect(screen.getByText('群主')).toBeInTheDocument();
    expect(screen.getByText('成员')).toBeInTheDocument();
  });

  it('filters members when searching', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜索成员');
    fireEvent.change(searchInput, { target: { value: '张三' } });
    
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.queryByText('李四')).not.toBeInTheDocument();
  });

  it('shows invite members button for admin and owner', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    expect(screen.getByText('邀请成员')).toBeInTheDocument();
  });

  it('disables invite members button for regular members', () => {
    render(
      <GroupMemberList 
        {...defaultProps} 
        currentUserRole={GroupRole.MEMBER}
      />
    );
    
    const inviteButton = screen.getByText('邀请成员');
    expect(inviteButton).toBeDisabled();
  });

  it('calls onInviteMembers when invite button is clicked', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    const inviteButton = screen.getByText('邀请成员');
    fireEvent.click(inviteButton);
    
    expect(defaultProps.onInviteMembers).toHaveBeenCalled();
  });

  it('shows member join time', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    expect(screen.getByText(/加入时间:/)).toBeInTheDocument();
  });

  it('shows online status indicator', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    // Check for online status indicators
    const badges = document.querySelectorAll('.ant-badge-dot');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('displays nickname when available', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    expect(screen.getByText('群主')).toBeInTheDocument();
    expect(screen.getByText('(张三)')).toBeInTheDocument();
  });

  it('shows username when no nickname is set', () => {
    render(<GroupMemberList {...defaultProps} />);
    
    expect(screen.getByText('李四')).toBeInTheDocument();
  });
}); 