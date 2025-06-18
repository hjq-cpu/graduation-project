const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 生成随机头像
const generateRandomAvatar = async (seed) => {
  try {
    // 使用 DiceBear 的 avataaars 风格生成头像
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    
    // 下载头像
    const response = await axios.get(avatarUrl, {
      responseType: 'arraybuffer'
    });

    // 确保 avatars 目录存在
    const avatarsDir = path.join(__dirname, '../public/avatars');
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }

    // 生成文件名
    const fileName = `avatar-${seed}.svg`;
    const filePath = path.join(avatarsDir, fileName);

    // 保存文件
    fs.writeFileSync(filePath, response.data);

    // 返回头像的URL路径（移除开头的斜杠）
    return `avatars/${fileName}`;
  } catch (error) {
    console.error('生成头像失败:', error);
    return 'avatars/default-avatar.png'; // 返回默认头像
  }
};

module.exports = {
  generateRandomAvatar
}; 