import axios from 'axios';

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
        
        // 添加认证头
        const token = localStorage.getItem('token');
        if (token && token.trim()) {
            config.headers['Authorization'] = `Bearer ${token.trim()}`;
        }
        
        console.log('Request config after headers:', config);
        console.log('Request headers:', config.headers);
        
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
        if (error.response?.status === 401) {
            // Token 过期或无效，清除本地存储并重定向到登录页
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