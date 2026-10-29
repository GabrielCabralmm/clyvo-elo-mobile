import { http } from './http';
import { CadastroTutorRequest, LoginResponse, Papel } from '@/types';

const ROTA_LOGIN: Record<Papel, string> = {
  Tutor: '/api/Auth/login/tutor',
  Doutor: '/api/Auth/login/doutor',
};

export async function entrar(papel: Papel, email: string, senha: string) {
  const { data } = await http.post<LoginResponse>(ROTA_LOGIN[papel], { email: email.trim(), senha });
  return data;
}

export async function cadastrarTutor(dados: CadastroTutorRequest) {
  const { data } = await http.post<LoginResponse>('/api/Auth/cadastro/tutor', dados);
  return data;
}
