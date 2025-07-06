const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  // 群组名称
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  // 群组描述
  description: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  // 群组头像
  avatar: {
    type: String,
    default: '/avatars/default-group-avatar.png'
  },
  // 群组创建者
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 群组管理员列表
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // 群组成员列表
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: 30,
      default: ''
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'owner'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    // 是否被禁言
    isMuted: {
      type: Boolean,
      default: false
    },
    // 禁言结束时间
    muteUntil: {
      type: Date,
      default: null
    }
  }],
  // 群组类型
  type: {
    type: String,
    enum: ['public', 'private', 'secret'],
    default: 'public'
  },
  // 群组状态
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  // 群组设置
  settings: {
    // 是否需要管理员审核新成员
    requireApproval: {
      type: Boolean,
      default: false
    },
    // 是否允许成员邀请新用户
    allowMemberInvite: {
      type: Boolean,
      default: true
    },
    // 是否允许成员修改群信息
    allowMemberEdit: {
      type: Boolean,
      default: false
    },
    // 最大成员数
    maxMembers: {
      type: Number,
      default: 500,
      min: 2,
      max: 2000
    },
    // 是否启用群公告
    enableAnnouncement: {
      type: Boolean,
      default: true
    }
  },
  // 群组公告
  announcement: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  // 群组标签
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  // 群组统计信息
  stats: {
    memberCount: {
      type: Number,
      default: 1
    },
    messageCount: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
groupSchema.index({ name: 'text', description: 'text' });
groupSchema.index({ creator: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ type: 1, status: 1 });
groupSchema.index({ tags: 1 });

// 虚拟字段：获取群组创建者信息
groupSchema.virtual('creatorInfo', {
  ref: 'User',
  localField: 'creator',
  foreignField: '_id',
  justOne: true
});

// 确保虚拟字段在JSON序列化时包含
groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

// 中间件：更新成员数量
groupSchema.pre('save', function(next) {
  if (this.members) {
    this.stats.memberCount = this.members.length;
  }
  next();
});

// 静态方法：获取用户加入的所有群组
groupSchema.statics.getUserGroups = function(userId) {
  return this.find({
    'members.user': userId,
    status: 'active'
  }).populate('creator', 'nickname avatar')
    .populate('members.user', 'nickname avatar status')
    .sort({ 'stats.lastActivity': -1 });
};

// 静态方法：获取公开群组
groupSchema.statics.getPublicGroups = function(limit = 20, skip = 0) {
  return this.find({
    type: 'public',
    status: 'active'
  }).populate('creator', 'nickname avatar')
    .sort({ 'stats.lastActivity': -1 })
    .limit(limit)
    .skip(skip);
};

// 静态方法：搜索群组
groupSchema.statics.searchGroups = function(query, limit = 20) {
  return this.find({
    $text: { $search: query },
    status: 'active'
  }).populate('creator', 'nickname avatar')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

// 静态方法：检查用户是否为群组成员
groupSchema.statics.isMember = function(groupId, userId) {
  return this.findOne({
    _id: groupId,
    'members.user': userId,
    status: 'active'
  });
};

// 静态方法：检查用户是否为群组管理员
groupSchema.statics.isAdmin = function(groupId, userId) {
  return this.findOne({
    _id: groupId,
    'members.user': userId,
    'members.role': { $in: ['admin', 'owner'] },
    status: 'active'
  });
};

// 实例方法：添加成员
groupSchema.methods.addMember = function(userId, role = 'member', nickname = '') {
  // 检查是否已经是成员
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('用户已经是群组成员');
  }
  
  // 检查群组是否已满
  if (this.members.length >= this.settings.maxMembers) {
    throw new Error('群组已达到最大成员数');
  }
  
  this.members.push({
    user: userId,
    role: role,
    nickname: nickname,
    joinedAt: new Date()
  });
  
  // 如果是管理员，添加到admins数组
  if (role === 'admin' || role === 'owner') {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
    }
  }
  
  return this.save();
};

// 实例方法：移除成员
groupSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(member => 
    member.user.toString() === userId.toString()
  );
  
  if (memberIndex === -1) {
    throw new Error('用户不是群组成员');
  }
  
  // 不能移除群组创建者
  if (this.creator.toString() === userId.toString()) {
    throw new Error('不能移除群组创建者');
  }
  
  this.members.splice(memberIndex, 1);
  
  // 从管理员列表中移除
  this.admins = this.admins.filter(admin => 
    admin.toString() !== userId.toString()
  );
  
  return this.save();
};

// 实例方法：更新成员角色
groupSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('用户不是群组成员');
  }
  
  member.role = newRole;
  
  // 更新管理员列表
  if (newRole === 'admin' || newRole === 'owner') {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
    }
  } else {
    this.admins = this.admins.filter(admin => 
      admin.toString() !== userId.toString()
    );
  }
  
  return this.save();
};

// 实例方法：禁言/解除禁言成员
groupSchema.methods.muteMember = function(userId, duration = null) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('用户不是群组成员');
  }
  
  member.isMuted = true;
  member.muteUntil = duration ? new Date(Date.now() + duration) : null;
  
  return this.save();
};

// 实例方法：解除禁言
groupSchema.methods.unmuteMember = function(userId) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('用户不是群组成员');
  }
  
  member.isMuted = false;
  member.muteUntil = null;
  
  return this.save();
};

// 实例方法：更新群组统计信息
groupSchema.methods.updateStats = function() {
  this.stats.memberCount = this.members.length;
  this.stats.lastActivity = new Date();
  return this.save();
};

const Group = mongoose.model('Group', groupSchema);

module.exports = Group; 