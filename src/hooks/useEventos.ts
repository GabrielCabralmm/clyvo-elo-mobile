import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proximoStatus } from '@/domain/eventos';
import { atualizarStatusEvento, criarEvento, excluirEvento, listarEventosDoPet } from '@/services/eventoService';
import { EventoClinico, NovoEventoClinico } from '@/types';
import { chaves } from './chavesDeConsulta';
import { juntarPaginas, PRIMEIRA_PAGINA, proximaPagina } from './paginacao';

export function useEventosDoPet(idPet: number) {
  const consulta = useInfiniteQuery({
    queryKey: chaves.eventosDoPet(idPet),
    queryFn: ({ pageParam }) => listarEventosDoPet(idPet, pageParam),
    initialPageParam: PRIMEIRA_PAGINA,
    getNextPageParam: proximaPagina,
    enabled: Number.isFinite(idPet),
  });

  return { ...consulta, eventos: juntarPaginas(consulta.data?.pages) };
}

export function useCriarEvento(idPet: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (evento: NovoEventoClinico) => criarEvento(evento),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.eventosDoPet(idPet) }),
  });
}

export function useAlternarStatusEvento(idPet: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (evento: EventoClinico) => atualizarStatusEvento(evento.idEvento, proximoStatus(evento.status)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.eventosDoPet(idPet) }),
  });
}

export function useExcluirEvento(idPet: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idEvento: number) => excluirEvento(idEvento),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.eventosDoPet(idPet) }),
  });
}
