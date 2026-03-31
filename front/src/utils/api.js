import axios from 'axios';
import { BASE_URL } from './BASE_URL';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Crucial for sending/receiving cookies
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                const { accessToken } = response.data;
                localStorage.setItem('token', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token expired or invalid
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
