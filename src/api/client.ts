import axios from 'axios';
import { storage } from '@/lib/storage';

export const API_URL = 'https://clyvoelo-dotnet.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
