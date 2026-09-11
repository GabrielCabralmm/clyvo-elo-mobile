import { api } from './client';
import { EventoClinico, NovoEventoClinico } from '../types';

export async function listarEventosPorPet(idPet: number) {
  const { data } = await api.get<EventoClinico[]>(`/api/EventosClinicos/pet/${idPet}`);
  return data;
}

export async function criarEvento(evento: NovoEventoClinico) {
  const { data } = await api.post<EventoClinico>('/api/EventosClinicos', evento);
  return data;
}

export async function atualizarStatusEvento(id: number, novoStatus: string) {
  await api.put(`/api/EventosClinicos/${id}/status`, JSON.stringify(novoStatus), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function excluirEvento(id: number) {
  await api.delete(`/api/EventosClinicos/${id}`);
}
