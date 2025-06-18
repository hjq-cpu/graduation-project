const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { generateRandomAvatar } = require('../utils/avatarGenerator');

// 获取 JWT 密钥
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('警告: JWT_SECRET 环境变量未设置，使用默认密钥');
    return 'default-jwt-secret-key-2024';
  }
  return secret;
};

// 用户注册
const register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 生成随机头像
    const seed = Math.random().toString(36).substring(7); // 生成随机种子
    const avatarPath = await generateRandomAvatar(seed);

    // 创建新用户
    const user = new User({
      email,
      password,
      nickname: nickname || '',
      avatar: avatarPath
    });

    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar
        }
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查参数
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '用户不存在或邮箱未注册'
      });
    }

    // 校验密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '密码错误'
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
};

module.exports = {
  register,
  login
}; 