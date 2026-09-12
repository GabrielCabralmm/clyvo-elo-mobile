import axios from 'axios';
import { router } from 'expo-router';
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url: string = error?.config?.url ?? '';
    const ehRotaDeAuth = url.includes('/Auth/login') || url.includes('/Auth/cadastro');

    if (error?.response?.status === 401 && !ehRotaDeAuth) {
      await storage.deleteItem('token');
      await storage.deleteItem('papel');
      await storage.deleteItem('nome');
      await storage.deleteItem('id');
      router.replace('/(auth)/login');
    }

    return Promise.reject(error);
  }
);
