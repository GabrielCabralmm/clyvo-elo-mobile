import { api } from './client';
import { LoginResponse, CadastroTutorRequest } from '../types';

export async function loginTutor(email: string, senha: string) {
  const { data } = await api.post<LoginResponse>('/api/Auth/login/tutor', { email, senha });
  return data;
}

export async function loginDoutor(email: string, senha: string) {
  const { data } = await api.post<LoginResponse>('/api/Auth/login/doutor', { email, senha });
  return data;
}

export async function cadastrarTutor(dados: CadastroTutorRequest) {
  const { data } = await api.post<LoginResponse>('/api/Auth/cadastro/tutor', dados);
  return data;
}
