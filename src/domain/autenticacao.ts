import { CadastroTutorRequest } from '@/types';
import { Validacao } from './pets';

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarLogin(email: string, senha: string): string | null {
  if (!email.trim() || !senha) {
    return 'Preencha o email e a senha.';
  }
  if (!FORMATO_EMAIL.test(email.trim())) {
    return 'Digite um email válido.';
  }
  return null;
}

export function validarCadastro(nome: string, email: string, senha: string, telefone: string): Validacao<CadastroTutorRequest> {
  if (!nome.trim() || !email.trim() || !senha) {
    return { ok: false, erro: 'Preencha nome, email e senha.' };
  }
  if (!FORMATO_EMAIL.test(email.trim())) {
    return { ok: false, erro: 'Digite um email válido.' };
  }
  if (senha.length < 6) {
    return { ok: false, erro: 'A senha precisa ter pelo menos 6 caracteres.' };
  }
  return {
    ok: true,
    valor: { nome: nome.trim(), email: email.trim().toLowerCase(), senha, telefone: telefone.trim() || undefined },
  };
}
