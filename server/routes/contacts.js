const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');

// 所有路由都需要身份验证
router.use(authenticateToken);

// 发送好友请求
router.post('/friend-request', contactController.sendFriendRequest);

// 接受好友请求
router.put('/friend-request/:contactId/accept', contactController.acceptFriendRequest);

// 拒绝好友请求
router.put('/friend-request/:contactId/reject', contactController.rejectFriendRequest);

// 获取好友列表
router.get('/friends', contactController.getFriendList);

// 获取待处理的好友请求
router.get('/pending-requests', contactController.getPendingRequests);

// 更新好友备注
router.put('/friend/:contactId/note', contactController.updateFriendNote);

// 删除好友
router.delete('/friend/:contactId', contactController.deleteFriend);

module.exports = router; 