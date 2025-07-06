import axios from 'axios';

// 获取认证头
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
const config = {
    baseUrl: 'http://localhost:3001',
    request: axios
};

export default config;