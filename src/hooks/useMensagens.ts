import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { buscarMensagem, enviarMensagem, excluirMensagem, listarMensagens, marcarComoLida } from '@/services/mensagemService';
import { NovaMensagem } from '@/types';
import { chaves } from './chavesDeConsulta';
import { juntarPaginas, PRIMEIRA_PAGINA, proximaPagina } from './paginacao';

export const INTERVALO_DE_ATUALIZACAO_MS = 30000;

export function useMensagens(idPet?: number) {
  const { ehDoutor, id } = useAuth();
  const filtro = { idPet, idDoutor: ehDoutor ? id ?? undefined : undefined };
  const consulta = useInfiniteQuery({
    queryKey: chaves.mensagens(filtro),
    queryFn: ({ pageParam }) => listarMensagens({ pagina: pageParam, ...filtro }),
    initialPageParam: PRIMEIRA_PAGINA,
    getNextPageParam: proximaPagina,
  });

  return { ...consulta, mensagens: juntarPaginas(consulta.data?.pages) };
}

export function useMensagensNaoLidas(ativo: boolean) {
  return useQuery({
    queryKey: chaves.naoLidas,
    queryFn: () => listarMensagens({ pagina: PRIMEIRA_PAGINA, tamanhoPagina: 50, lida: false }),
    enabled: ativo,
    refetchInterval: INTERVALO_DE_ATUALIZACAO_MS,
    select: (pagina) => pagina.itens,
  });
}

export function useMensagem(id: string) {
  return useQuery({ queryKey: chaves.mensagem(id), queryFn: () => buscarMensagem(id), enabled: !!id });
}

export function useEnviarMensagem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mensagem: NovaMensagem) => enviarMensagem(mensagem),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.todasAsMensagens }),
  });
}

export function useMarcarComoLida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marcarComoLida(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: chaves.mensagem(id) });
      queryClient.invalidateQueries({ queryKey: chaves.todasAsMensagens });
    },
  });
}

export function useExcluirMensagem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => excluirMensagem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaves.todasAsMensagens }),
  });
}
