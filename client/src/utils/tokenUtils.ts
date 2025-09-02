/**
 * Token工具函数 - 处理token的编码和解码
 * 确保HTTP请求头只包含ASCII字符，避免"String contains non ISO-8859-1 code point"错误
 */

/**
 * 检查字符串是否只包含ASCII字符
 * @param str 要检查的字符串
 * @returns 是否只包含ASCII字符
 */
export const isAsciiOnly = (str: string): boolean => {
  return /^[\x00-\x7F]*$/.test(str);
};

/**
 * 清理token，确保格式正确且只包含ASCII字符
 * @param token 原始token
 * @returns 清理后的token
 */
export const cleanToken = (token: string): string => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token: token must be a non-empty string');
  }
  
  const trimmedToken = token.trim();
  
  // 检查是否为空
  if (!trimmedToken) {
    throw new Error('Invalid token: token cannot be empty');
  }
  
  // 检查是否只包含ASCII字符
  if (!isAsciiOnly(trimmedToken)) {
    console.warn('Token contains non-ASCII characters, attempting to clean...');
    // 尝试移除非ASCII字符
    const cleanedToken = trimmedToken.replace(/[^\x00-\x7F]/g, '');
    if (!cleanedToken) {
      throw new Error('Invalid token: token contains only non-ASCII characters');
    }
    return cleanedToken;
  }
  
  return trimmedToken;
};

/**
 * 创建Authorization请求头
 * @param token 用户token
 * @returns Authorization请求头值
 */
export const createAuthHeader = (token: string): string => {
  try {
    const cleanTokenValue = cleanToken(token);
    const headerValue = `Bearer ${cleanTokenValue}`;
    
    // 最终验证整个头部值
    if (!isAsciiOnly(headerValue)) {
      throw new Error('Authorization header contains non-ASCII characters');
    }
    
    return headerValue;
  } catch (error) {
    console.error('Error creating auth header:', error);
    throw error;
  }
};

/**
 * 验证token格式
 * @param token 要验证的token
 * @returns 是否有效
 */
export const validateToken = (token: string): boolean => {
  try {
    cleanToken(token);
    return true;
  } catch {
    return false;
  }
};

/**
 * 安全地获取和验证token
 * @returns 验证后的token或null
 */
export const getValidToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    return cleanToken(token);
  } catch (error) {
    console.error('Invalid token in localStorage:', error);
    // 清除无效的token
    localStorage.removeItem('token');
    return null;
  }
}; 