import axios from 'axios';

export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});