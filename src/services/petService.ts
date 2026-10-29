import { http } from './http';
import { NovoPet, Pagina, Pet } from '@/types';

export interface FiltroPets {
  pagina: number;
  tamanhoPagina?: number;
  nome?: string;
}

export async function listarPets({ pagina, tamanhoPagina = 10, nome }: FiltroPets) {
  const { data } = await http.get<Pagina<Pet>>('/api/Pets', {
    params: { pagina, tamanhoPagina, nome: nome || undefined, ordenarPor: 'nome' },
  });
  return data;
}

export async function listarMeusPets({ pagina, tamanhoPagina = 10, nome }: FiltroPets) {
  const { data } = await http.get<Pagina<Pet>>('/api/Pets/meus', {
    params: { pagina, tamanhoPagina, nome: nome || undefined, ordenarPor: 'nome' },
  });
  return data;
}

export async function buscarPet(id: number) {
  const { data } = await http.get<Pet>(`/api/Pets/${id}`);
  return data;
}

export async function criarPet(pet: NovoPet) {
  const { data } = await http.post<Pet>('/api/Pets', pet);
  return data;
}

export async function atualizarPeso(id: number, pesoKg: number) {
  await http.put(`/api/Pets/${id}/peso`, JSON.stringify(pesoKg), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function excluirPet(id: number) {
  await http.delete(`/api/Pets/${id}`);
}
