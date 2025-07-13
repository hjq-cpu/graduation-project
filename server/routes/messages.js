const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

// 所有路由都需要身份验证
router.use(authenticateToken);

// 获取最近聊天列表
router.get('/recent-conversations', messageController.getRecentConversations);

// 获取与指定用户的聊天记录
router.get('/conversation/:targetUserId', messageController.getConversation);

// 发送消息
router.post('/send', messageController.sendMessage);

// 标记消息为已读
router.put('/mark-read/:senderId', messageController.markAsRead);

// 删除消息
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router; 