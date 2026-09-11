import { api } from './client';
import { Pet, NovoPet } from '../types';

export async function listarPets() {
  const { data } = await api.get<Pet[]>('/api/Pets');
  return data;
}

export async function listarMeusPets() {
  const { data } = await api.get<Pet[]>('/api/Pets/meus');
  return data;
}

export async function buscarPet(id: number) {
  const { data } = await api.get<Pet>(`/api/Pets/${id}`);
  return data;
}

export async function criarPet(pet: NovoPet) {
  const { data } = await api.post<Pet>('/api/Pets', pet);
  return data;
}

export async function atualizarPeso(id: number, pesoKg: number) {
  await api.put(`/api/Pets/${id}/peso`, JSON.stringify(pesoKg), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function excluirPet(id: number) {
  await api.delete(`/api/Pets/${id}`);
}
