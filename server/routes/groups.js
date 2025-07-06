const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
// 需要身份验证中间件时可加上
// const { authMiddleware } = require('../middleware/auth');

// 创建群组
router.post('/', groupController.createGroup);
// 获取用户加入的群组列表
router.get('/my', groupController.getUserGroups);
// 获取公开群组列表
router.get('/public', groupController.getPublicGroups);
// 搜索群组
router.get('/search', groupController.searchGroups);
// 获取群组详情
router.get('/:groupId', groupController.getGroupDetail);
// 加入群组
router.post('/:groupId/join', groupController.joinGroup);
// 退出群组
router.post('/:groupId/leave', groupController.leaveGroup);
// 邀请成员
router.post('/:groupId/invite', groupController.inviteMembers);
// 踢出成员
router.post('/:groupId/remove', groupController.removeMember);
// 修改群组信息
router.put('/:groupId', groupController.updateGroup);
// 删除群组
router.delete('/:groupId', groupController.deleteGroup);

module.exports = router; 