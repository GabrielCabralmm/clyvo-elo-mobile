import { http } from './http';
import { Mensagem, NovaMensagem, Pagina } from '@/types';

export interface FiltroMensagens {
  pagina: number;
  tamanhoPagina?: number;
  idPet?: number;
  idDoutor?: number;
  lida?: boolean;
}

export async function listarMensagens({ pagina, tamanhoPagina = 15, idPet, idDoutor, lida }: FiltroMensagens) {
  const { data } = await http.get<Pagina<Mensagem>>('/api/Mensagens', {
    params: { pagina, tamanhoPagina, idPet, idDoutor, lida },
  });
  return data;
}

export async function buscarMensagem(id: string) {
  const { data } = await http.get<Mensagem>(`/api/Mensagens/${id}`);
  return data;
}

export async function enviarMensagem(mensagem: NovaMensagem) {
  const { data } = await http.post<Mensagem>('/api/Mensagens', mensagem);
  return data;
}

export async function marcarComoLida(id: string) {
  await http.patch(`/api/Mensagens/${id}/lida`);
}

export async function excluirMensagem(id: string) {
  await http.delete(`/api/Mensagens/${id}`);
}
