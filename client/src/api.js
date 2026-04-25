import axios from 'axios';

// In production (Render), frontend & backend share the same origin, so '/api' works.
// In local dev, VITE_API_URL in client/.env overrides this (e.g. http://localhost:5000/api).
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getToken() {
  return localStorage.getItem('token');
}
