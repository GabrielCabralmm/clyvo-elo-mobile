import { Pagina } from '@/types';

export const PRIMEIRA_PAGINA = 1;

export function proximaPagina<T>(ultima: Pagina<T>) {
  return ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined;
}

export function juntarPaginas<T>(paginas?: Pagina<T>[]) {
  return paginas?.flatMap((pagina) => pagina.itens) ?? [];
}
