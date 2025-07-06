const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // 发起好友请求的用户ID
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 接收好友请求的用户ID
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 好友关系状态
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  // 好友备注名（发起者给接收者的备注）
  requesterNote: {
    type: String,
    trim: true,
    maxlength: 50,
    default: ''
  },
  // 好友备注名（接收者给发起者的备注）
  recipientNote: {
    type: String,
    trim: true,
    maxlength: 50,
    default: ''
  },
  // 好友分组（发起者的分组）
  requesterGroup: {
    type: String,
    trim: true,
    default: '我的好友'
  },
  // 好友分组（接收者的分组）
  recipientGroup: {
    type: String,
    trim: true,
    default: '我的好友'
  },
  // 是否置顶（发起者）
  requesterPinned: {
    type: Boolean,
    default: false
  },
  // 是否置顶（接收者）
  recipientPinned: {
    type: Boolean,
    default: false
  },
  // 最后互动时间
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  // 好友请求消息
  requestMessage: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  // 拒绝原因
  rejectReason: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  }
}, {
  timestamps: true
});

// 创建复合索引，确保同一对用户之间只有一条好友关系记录
contactSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// 创建索引以提高查询性能
contactSchema.index({ requester: 1, status: 1 });
contactSchema.index({ recipient: 1, status: 1 });
contactSchema.index({ status: 1 });

// 虚拟字段：获取好友信息
contactSchema.virtual('friendInfo', {
  ref: 'User',
  localField: 'recipient',
  foreignField: '_id',
  justOne: true
});

// 确保虚拟字段在JSON序列化时包含
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

// 静态方法：获取用户的所有好友
contactSchema.statics.getUserFriends = function(userId) {
  return this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester', 'nickname avatar email status')
    .populate('recipient', 'nickname avatar email status');
};

// 静态方法：获取待处理的好友请求
contactSchema.statics.getPendingRequests = function(userId) {
  return this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'nickname avatar email');
};

// 静态方法：检查两个用户是否为好友
contactSchema.statics.areFriends = function(userId1, userId2) {
  return this.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  });
};

// 实例方法：接受好友请求
contactSchema.methods.acceptRequest = function() {
  this.status = 'accepted';
  this.lastInteraction = new Date();
  return this.save();
};

// 实例方法：拒绝好友请求
contactSchema.methods.rejectRequest = function(reason = '') {
  this.status = 'rejected';
  this.rejectReason = reason;
  return this.save();
};

// 实例方法：屏蔽好友
contactSchema.methods.blockContact = function() {
  this.status = 'blocked';
  return this.save();
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 