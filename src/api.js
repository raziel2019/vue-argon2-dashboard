import axios from 'axios';


const apiClient = axios.create({
    baseURL: 'https://apilaravel.racielhernandez.com/api/', 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('auth_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;