const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // 发送者ID
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 接收者ID（私聊）或群组ID（群聊）
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: true
  },
  // 接收者类型：'User' 或 'Group'
  recipientModel: {
    type: String,
    enum: ['User', 'Group'],
    required: true
  },
  // 消息内容
  content: {
    type: String,
    required: true,
    trim: true
  },
  // 消息类型
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'video'],
    default: 'text'
  },
  // 消息状态
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  // 是否已读
  isRead: {
    type: Boolean,
    default: false
  },
  // 消息引用（回复某条消息）
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // 消息元数据（文件大小、时长等）
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// 静态方法：获取两个用户之间的聊天记录
messageSchema.statics.getConversation = function(userId1, userId2, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { sender: userId1, recipient: userId2, recipientModel: 'User' },
      { sender: userId2, recipient: userId1, recipientModel: 'User' }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'nickname avatar')
  .populate('recipient', 'nickname avatar');
};

// 静态方法：获取用户的最近聊天列表
messageSchema.statics.getRecentConversations = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { recipient: mongoose.Types.ObjectId(userId), recipientModel: 'User' }
        ]
      }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
            '$recipient',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        user: {
          _id: '$user._id',
          nickname: '$user.nickname',
          avatar: '$user.avatar',
          status: '$user.status'
        },
        lastMessage: {
          _id: '$lastMessage._id',
          content: '$lastMessage.content',
          type: '$lastMessage.type',
          createdAt: '$lastMessage.createdAt',
          sender: '$lastMessage.sender'
        },
        unreadCount: 1
      }
    }
  ]);
};

// 静态方法：标记消息为已读
messageSchema.statics.markAsRead = function(senderId, recipientId) {
  return this.updateMany(
    {
      sender: senderId,
      recipient: recipientId,
      recipientModel: 'User',
      isRead: false
    },
    {
      isRead: true,
      status: 'read'
    }
  );
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 