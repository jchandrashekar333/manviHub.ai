import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors (token expiry)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            // Could trigger a re-login modal here
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    signup: (email: string, password: string, name?: string) =>
        api.post('/auth/signup', { email, password, name }),
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    getMe: () => api.get('/auth/me'),
};

export const toolsApi = {
    getAll: () => api.get('/tools'),
    getById: (id: string) => api.get(`/tools/${id}`),
    save: (id: string) => api.post(`/tools/${id}/save`),
    unsave: (id: string) => api.delete(`/tools/${id}/save`),
    like: (id: string) => api.post(`/tools/${id}/like`),
    checkStatus: (toolIds: string[]) => api.post('/tools/check-status', { toolIds }),
};

export const userApi = {
    getSavedTools: () => api.get('/users/me/saved-tools'),
};

export const commentsApi = {
    getByToolId: (toolId: string) => api.get(`/comments/${toolId}`),
    create: (toolId: string, content: string) =>
        api.post('/comments', { toolId, content }),
};

export const submissionsApi = {
    submit: (toolData: { name: string; description: string; category: string; url: string; isPaid: boolean }) =>
        api.post('/submissions/submit', toolData),
    getMySubmissions: () => api.get('/submissions/my-submissions'),
    getPending: () => api.get('/submissions/pending'),
    approve: (id: string) => api.post(`/submissions/approve/${id}`),
    reject: (id: string, reason?: string) => api.post(`/submissions/reject/${id}`, { reason })
};

export default api;
