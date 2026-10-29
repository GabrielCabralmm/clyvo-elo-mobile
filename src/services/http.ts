import axios from 'axios';
import { router } from 'expo-router';
import { limparSessaoSalva } from '@/lib/sessao';

export const API_URL = 'https://clyvoelo-dotnet.onrender.com';

export const http = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

let tokenAtual: string | null = null;

export function definirToken(token: string | null) {
  tokenAtual = token;
}

http.interceptors.request.use((config) => {
  if (tokenAtual) {
    config.headers.Authorization = `Bearer ${tokenAtual}`;
  }
  return config;
});

http.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    const url: string = erro?.config?.url ?? '';
    const ehRotaDeAuth = url.includes('/Auth/login') || url.includes('/Auth/cadastro');

    if (erro?.response?.status === 401 && !ehRotaDeAuth) {
      definirToken(null);
      await limparSessaoSalva();
      router.replace('/(auth)/login');
    }

    return Promise.reject(erro);
  }
);
