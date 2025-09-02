const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 解码token（如果是base64编码的）
const decodeToken = (token) => {
  // 检查token是否是有效的JWT格式（包含两个点）
  if (token.split('.').length === 3) {
    // 这是有效的JWT格式，不需要base64解码
    return token;
  }
  
  try {
    // 尝试base64解码（只有在token不是JWT格式时才尝试）
    return Buffer.from(token, 'base64').toString('utf8');
  } catch (error) {
    // 如果解码失败，直接返回原始token
    return token;
  }
};

// 获取 JWT 密钥
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  // console.log('环境变量JWT_SECRET:', secret);
  // console.log('所有环境变量:', Object.keys(process.env).filter(key => key.includes('JWT')));
  
  if (!secret) {
    console.warn('警告: JWT_SECRET 环境变量未设置，使用默认密钥');
    return 'default-jwt-secret-key-2024';
  }
  return secret;
};

// 确保JWT密钥一致性
const JWT_SECRET = getJwtSecret();
// console.log('=== JWT密钥初始化 ===');
// console.log('使用的JWT密钥:', JWT_SECRET);

// 验证 JWT token 中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('=== 服务器端Token验证调试 ===');
    console.log('Authorization头:', authHeader);
    console.log('提取的token:', token);
    console.log('JWT密钥:', getJwtSecret());

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
    }

    // 解码token（如果是base64编码的）
    const decodedToken = decodeToken(token);
    // console.log('解码后的token:', decodedToken);
    
    // 验证 token
    const decoded = jwt.verify(decodedToken, JWT_SECRET);
    // console.log('JWT验证成功，解码结果:', decoded);
    
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
      userId: user._id.toString(),
      email: user.email
    };

    next();
  } catch (error) {
    console.error('JWT验证错误详情:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT签名验证失败，可能的原因：');
      console.error('1. JWT密钥不匹配');
      console.error('2. Token格式错误');
      console.error('3. Token被篡改');
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