const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 获取 JWT 密钥
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('警告: JWT_SECRET 环境变量未设置，使用默认密钥');
    return 'default-jwt-secret-key-2024';
  }
  return secret;
};

// 验证 JWT token 中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
    }

    // 验证 token
    const decoded = jwt.verify(token, getJwtSecret());
    
    // 检查用户是否存在
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 将用户信息添加到请求对象
    req.user = {
      userId: user._id,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '访问令牌已过期'
      });
    } else {
      console.error('身份验证错误:', error);
      return res.status(500).json({
        success: false,
        message: '身份验证失败'
      });
    }
  }
};

module.exports = {
  authenticateToken
}; 