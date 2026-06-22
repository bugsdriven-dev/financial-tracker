import axios from 'axios';

// This creates a connection to our backend
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// This automatically adds the login token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;