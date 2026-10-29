import { http } from './http';
import { EventoClinico, NovoEventoClinico, Pagina, StatusEvento } from '@/types';

export async function listarEventosDoPet(idPet: number, pagina: number, tamanhoPagina = 20) {
  const { data } = await http.get<Pagina<EventoClinico>>(`/api/EventosClinicos/pet/${idPet}`, {
    params: { pagina, tamanhoPagina },
  });
  return data;
}

export async function criarEvento(evento: NovoEventoClinico) {
  const { data } = await http.post<EventoClinico>('/api/EventosClinicos', evento);
  return data;
}

export async function atualizarStatusEvento(id: number, novoStatus: StatusEvento) {
  await http.put(`/api/EventosClinicos/${id}/status`, JSON.stringify(novoStatus), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function excluirEvento(id: number) {
  await http.delete(`/api/EventosClinicos/${id}`);
}
