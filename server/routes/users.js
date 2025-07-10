const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { validateRegister } = require('../middleware/validateRequest');
const { authenticateToken } = require('../middleware/auth');

// 用户注册路由
router.post('/register', validateRegister, register);
// 用户登录路由
router.post('/login', login);
// 获取/搜索用户列表
router.get('/', authenticateToken, getAllUsers);
// 获取用户资料
router.get('/profile', authenticateToken, getUserProfile);
// 更新用户资料
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router; 
