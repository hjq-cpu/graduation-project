const { Message, User, Contact } = require('../models');

// 获取最近聊天列表
const getRecentConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 获取最近聊天列表
    const conversations = await Message.getRecentConversations(userId);

    // 过滤掉非好友的聊天（可选，根据需求决定）
    const friendIds = await Contact.distinct('recipient', {
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    const filteredConversations = conversations.filter(conv => 
      friendIds.some(id => id.toString() === conv.userId.toString())
    );

    res.status(200).json({
      success: true,
      data: {
        conversations: filteredConversations,
        total: filteredConversations.length
      }
    });

  } catch (error) {
    console.error('获取最近聊天列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取最近聊天列表失败，请稍后重试'
    });
  }
};

// 获取与指定用户的聊天记录
const getConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { targetUserId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // 验证目标用户是否存在
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 检查是否为好友关系
    const isFriend = await Contact.areFriends(userId, targetUserId);
    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: '只能查看好友的聊天记录'
      });
    }

    // 获取聊天记录
    const messages = await Message.getConversation(userId, targetUserId, parseInt(limit), parseInt(skip));

    // 标记消息为已读
    await Message.markAsRead(targetUserId, userId);

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // 按时间正序返回
        total: messages.length
      }
    });

  } catch (error) {
    console.error('获取聊天记录错误:', error);
    res.status(500).json({
      success: false,
      message: '获取聊天记录失败，请稍后重试'
    });
  }
};

// 发送消息
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { recipientId, content, type = 'text', replyTo } = req.body;

    // 验证参数
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: '接收者ID和消息内容不能为空'
      });
    }

    // 验证接收者是否存在
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: '接收者不存在'
      });
    }

    // 检查是否为好友关系
    const isFriend = await Contact.areFriends(senderId, recipientId);
    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: '只能给好友发送消息'
      });
    }

    // 创建消息
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      recipientModel: 'User',
      content,
      type,
      replyTo
    });

    await message.save();

    // 填充发送者信息
    await message.populate('sender', 'nickname avatar');

    res.status(201).json({
      success: true,
      message: '消息发送成功',
      data: {
        id: message._id,
        content: message.content,
        type: message.type,
        sender: message.sender,
        recipient: recipientId,
        createdAt: message.createdAt,
        status: message.status
      }
    });

  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({
      success: false,
      message: '发送消息失败，请稍后重试'
    });
  }
};

// 标记消息为已读
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { senderId } = req.params;

    // 验证发送者是否存在
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: '发送者不存在'
      });
    }

    // 标记消息为已读
    const result = await Message.markAsRead(senderId, userId);

    res.status(200).json({
      success: true,
      message: '消息已标记为已读',
      data: {
        updatedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('标记消息已读错误:', error);
    res.status(500).json({
      success: false,
      message: '标记消息已读失败，请稍后重试'
    });
  }
};

// 删除消息
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      });
    }

    // 只能删除自己发送的消息
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '只能删除自己发送的消息'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: '消息删除成功'
    });

  } catch (error) {
    console.error('删除消息错误:', error);
    res.status(500).json({
      success: false,
      message: '删除消息失败，请稍后重试'
    });
  }
};

module.exports = {
  getRecentConversations,
  getConversation,
  sendMessage,
  markAsRead,
  deleteMessage
}; 