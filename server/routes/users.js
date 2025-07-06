const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/userController');
const { validateRegister } = require('../middleware/validateRequest');

// 用户注册路由
router.post('/register', validateRegister, register);
// 用户登录路由
router.post('/login', login);
// 获取/搜索用户列表
router.get('/', getAllUsers);

module.exports = router; 
