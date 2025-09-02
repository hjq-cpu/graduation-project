import axios from 'axios';
import { getValidToken } from '../utils/tokenUtils';

// 创建 axios 实例
const request = axios.create({
    baseURL: 'http://localhost:3001'
});

// 请求拦截器 - 动态添加认证头
request.interceptors.request.use(
    (config) => {
        console.log('Request config before headers:', config);
        
        // 设置基本请求头
        config.headers['Content-Type'] = 'application/json';
        
        // 添加认证头 - 使用新的token验证函数
        try {
            const token = getValidToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('Authorization header set successfully');
            } else {
                console.log('No valid token found, skipping Authorization header');
            }
        } catch (error) {
            console.error('Error setting Authorization header:', error);
            // 不要阻止请求，只是不设置认证头
        }
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理常见错误
request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });
        
        if (error.response?.status === 401) {
            console.log('收到401错误，清除token并重定向到登录页');
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

const config = {
    baseUrl: 'http://localhost:3001',
    request
};

export default config;