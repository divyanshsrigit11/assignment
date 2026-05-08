import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

// // centralizing all endpoints
// export const authService = {
//     login: (credentials: any) => api.post('/auth/login', credentials),
//     logout: () => api.post('/auth/logout'),
//     getMe: () => api.get('/auth/me')
// };