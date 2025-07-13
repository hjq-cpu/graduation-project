import config from "./base";

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'video';
  sender: {
    _id: string;
    nickname: string;
    avatar?: string;
  };
  recipient: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  replyTo?: string;
  metadata?: any;
}

export interface Conversation {
  userId: string;
  user: {
    _id: string;
    nickname: string;
    avatar?: string;
    status: string;
  };
  lastMessage: {
    _id: string;
    content: string;
    type: string;
    createdAt: string;
    sender: string;
  };
  unreadCount: number;
}

export const messagesService = {
  // 获取最近聊天列表
  async getRecentConversations(): Promise<{ success: boolean; data: { conversations: Conversation[]; total: number } }> {
    const response = await config.request.get("/messages/recent-conversations");
    return response.data;
  },

  // 获取与指定用户的聊天记录
  async getConversation(targetUserId: string, limit: number = 50, skip: number = 0): Promise<{ success: boolean; data: { messages: Message[]; total: number } }> {
    const response = await config.request.get(`/messages/conversation/${targetUserId}`, {
      params: { limit, skip }
    });
    return response.data;
  },

  // 发送消息
  async sendMessage(recipientId: string, content: string, type: string = 'text', replyTo?: string): Promise<{ success: boolean; data: Message }> {
    const response = await config.request.post("/messages/send", {
      recipientId,
      content,
      type,
      replyTo
    });
    return response.data;
  },

  // 标记消息为已读
  async markAsRead(senderId: string): Promise<{ success: boolean; data: { updatedCount: number } }> {
    const response = await config.request.put(`/messages/mark-read/${senderId}`);
    return response.data;
  },

  // 删除消息
  async deleteMessage(messageId: string): Promise<{ success: boolean; message: string }> {
    const response = await config.request.delete(`/messages/${messageId}`);
    return response.data;
  }
}; 