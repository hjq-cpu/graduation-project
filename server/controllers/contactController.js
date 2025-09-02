const { Contact, User } = require('../models');

// 发送好友请求
const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.userId;
    const { email, requestMessage } = req.body;
    console.log(email, requestMessage);
    
    // 验证参数
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '接收者邮箱不能为空'
      });
    }
    
    // 检查接收者是否存在
    const recipient = await User.findOne({ email: email });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: '接收者不存在'
      });
    }
    
    // 检查是否给自己发送请求
    if (requesterId === recipient._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能给自己发送好友请求'
      });
    }

    // 检查是否已经存在好友关系
    const existingContact = await Contact.findOne({
      $or: [
        { requester: requesterId, recipient: recipient._id },
        { requester: recipient._id, recipient: requesterId }
      ]
    });

    if (existingContact) {
      if (existingContact.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: '已经是好友关系'
        });
      } else if (existingContact.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: '好友请求已发送，等待对方处理'
        });
      } else if (existingContact.status === 'rejected') {
        return res.status(400).json({
          success: false,
          message: '好友请求已被拒绝'
        });
      } else if (existingContact.status === 'blocked') {
        return res.status(400).json({
          success: false,
          message: '无法发送请求，已被屏蔽'
        });
      }
    }

    // 创建新的好友请求
    const contact = new Contact({
      requester: requesterId,
      recipient: recipient._id,
      requestMessage: requestMessage || ''
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: '好友请求发送成功',
      data: {
        id: contact._id,
        status: contact.status,
        requestMessage: contact.requestMessage,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('发送好友请求错误:', error);
    res.status(500).json({
      success: false,
      message: '发送好友请求失败，请稍后重试'
    });
  }
};

// 接受好友请求
const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '好友请求不存在'
      });
    }

    // 检查是否是接收者
    if (contact.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权操作此好友请求'
      });
    }

    // 检查状态
    if (contact.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '该请求已被处理'
      });
    }

    // 接受请求
    await contact.acceptRequest();

    res.status(200).json({
      success: true,
      message: '好友请求已接受',
      data: {
        id: contact._id,
        status: contact.status,
        lastInteraction: contact.lastInteraction
      }
    });

  } catch (error) {
    console.error('接受好友请求错误:', error);
    res.status(500).json({
      success: false,
      message: '接受好友请求失败，请稍后重试'
    });
  }
};

// 拒绝好友请求
const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contactId } = req.params;
    const { rejectReason } = req.body;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '好友请求不存在'
      });
    }

    // 检查是否是接收者
    if (contact.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权操作此好友请求'
      });
    }

    // 检查状态
    if (contact.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '该请求已被处理'
      });
    }

    // 拒绝请求
    await contact.rejectRequest(rejectReason);

    res.status(200).json({
      success: true,
      message: '好友请求已拒绝',
      data: {
        id: contact._id,
        status: contact.status,
        rejectReason: contact.rejectReason
      }
    });

  } catch (error) {
    console.error('拒绝好友请求错误:', error);
    res.status(500).json({
      success: false,
      message: '拒绝好友请求失败，请稍后重试'
    });
  }
};

// 获取好友列表
const getFriendList = async (req, res) => {
  try {
    const userId = req.user.userId;

    const friends = await Contact.getUserFriends(userId);

    const friendList = friends.map(contact => {
      const isRequester = contact.requester._id.toString() === userId;
      const friend = isRequester ? contact.recipient : contact.requester;
      const note = isRequester ? contact.requesterNote : contact.recipientNote;
      const group = isRequester ? contact.requesterGroup : contact.recipientGroup;
      const pinned = isRequester ? contact.requesterPinned : contact.recipientPinned;

      return {
        id: contact._id,
        friendId: friend._id,
        nickname: friend.nickname,
        avatar: friend.avatar,
        email: friend.email,
        status: friend.status,
        note: note,
        group: group,
        pinned: pinned,
        lastInteraction: contact.lastInteraction
      };
    });

    // 按置顶和最后互动时间排序
    friendList.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastInteraction) - new Date(a.lastInteraction);
    });

    res.status(200).json({
      success: true,
      data: {
        friends: friendList,
        total: friendList.length
      }
    });

  } catch (error) {
    console.error('获取好友列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取好友列表失败，请稍后重试'
    });
  }
};

// 获取待处理的好友请求
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pendingRequests = await Contact.getPendingRequests(userId);

    const requests = pendingRequests.map(contact => ({
      id: contact._id,
      requesterId: contact.requester._id,
      requesterNickname: contact.requester.nickname || contact.requester.email,
      requesterAvatar: contact.requester.avatar,
      requesterEmail: contact.requester.email,
      requestMessage: contact.requestMessage,
      createdAt: contact.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        requests: requests,
        total: requests.length
      }
    });

  } catch (error) {
    console.error('获取待处理请求错误:', error);
    res.status(500).json({
      success: false,
      message: '获取待处理请求失败，请稍后重试'
    });
  }
};

// 更新好友备注
const updateFriendNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contactId } = req.params;
    const { note } = req.body;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '好友关系不存在'
      });
    }

    // 检查是否是好友关系
    if (contact.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: '不是好友关系'
      });
    }

    // 更新备注
    if (contact.requester.toString() === userId) {
      contact.requesterNote = note || '';
    } else if (contact.recipient.toString() === userId) {
      contact.recipientNote = note || '';
    } else {
      return res.status(403).json({
        success: false,
        message: '无权操作此好友关系'
      });
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: '备注更新成功',
      data: {
        id: contact._id,
        note: note || ''
      }
    });

  } catch (error) {
    console.error('更新好友备注错误:', error);
    res.status(500).json({
      success: false,
      message: '更新好友备注失败，请稍后重试'
    });
  }
};

// 删除好友
const deleteFriend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '好友关系不存在'
      });
    }

    // 检查是否是好友关系
    if (contact.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: '不是好友关系'
      });
    }

    // 检查是否有权限删除
    if (contact.requester.toString() !== userId && contact.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权操作此好友关系'
      });
    }

    await Contact.findByIdAndDelete(contactId);

    res.status(200).json({
      success: true,
      message: '好友关系已删除'
    });

  } catch (error) {
    console.error('删除好友错误:', error);
    res.status(500).json({
      success: false,
      message: '删除好友失败，请稍后重试'
    });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendList,
  getPendingRequests,
  updateFriendNote,
  deleteFriend
}; 