import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { atualizarPeso, buscarPet, criarPet, excluirPet, listarMeusPets, listarPets } from '@/services/petService';
import { NovoPet } from '@/types';
import { chaves } from './chavesDeConsulta';
import { juntarPaginas, PRIMEIRA_PAGINA, proximaPagina } from './paginacao';

export function usePets(busca: string) {
  const { papel, ehDoutor } = useAuth();
  const consulta = useInfiniteQuery({
    queryKey: chaves.pets(papel, busca),
    queryFn: ({ pageParam }) => (ehDoutor ? listarPets : listarMeusPets)({ pagina: pageParam, nome: busca }),
    initialPageParam: PRIMEIRA_PAGINA,
    getNextPageParam: proximaPagina,
  });

  return {
    ...consulta,
    pets: juntarPaginas(consulta.data?.pages),
    total: consulta.data?.pages[0]?.totalItens ?? 0,
  };
}

export function usePet(id: number) {
  return useQuery({ queryKey: chaves.pet(id), queryFn: () => buscarPet(id), enabled: Number.isFinite(id) });
}

export function useCriarPet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pet: NovoPet) => criarPet(pet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.todosOsPets }),
  });
}

export function useAtualizarPeso(idPet: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pesoKg: number) => atualizarPeso(idPet, pesoKg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chaves.pet(idPet) });
      queryClient.invalidateQueries({ queryKey: chaves.todosOsPets });
    },
  });
}

export function useExcluirPet(idPet: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => excluirPet(idPet),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: chaves.pet(idPet) });
      queryClient.invalidateQueries({ queryKey: chaves.todosOsPets });
    },
  });
}
