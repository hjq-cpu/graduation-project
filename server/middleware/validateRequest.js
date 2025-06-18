const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  // 验证邮箱格式
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(200).json({
      success: false,
      message: '请提供有效的邮箱地址'
    });
  }

  // 验证密码长度
  if (!password || password.length < 6) {
    return res.status(200).json({
      success: false,
      message: '密码长度至少为6位'
    });
  }

  next();
};

module.exports = {
  validateRegister
}; 