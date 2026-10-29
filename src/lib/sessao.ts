import { storage } from '@/lib/storage';
import { Papel } from '@/types';

export interface SessaoSalva {
  token: string;
  papel: Papel;
  nome: string;
  id: number;
}

const CHAVES = ['token', 'papel', 'nome', 'id'] as const;

export async function lerSessaoSalva(): Promise<SessaoSalva | null> {
  const [token, papel, nome, id] = await Promise.all(CHAVES.map((chave) => storage.getItem(chave)));
  if (!token || !papel) {
    return null;
  }
  return { token, papel: papel as Papel, nome: nome ?? '', id: Number(id) };
}

export async function salvarSessao(sessao: SessaoSalva) {
  await Promise.all([
    storage.setItem('token', sessao.token),
    storage.setItem('papel', sessao.papel),
    storage.setItem('nome', sessao.nome),
    storage.setItem('id', String(sessao.id)),
  ]);
}

export async function limparSessaoSalva() {
  await Promise.all(CHAVES.map((chave) => storage.deleteItem(chave)));
}
