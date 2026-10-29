import { CategoriaMensagem, Mensagem, NovaMensagem } from '@/types';
import { Validacao } from './pets';

export const CATEGORIAS_MENSAGEM: { valor: CategoriaMensagem; rotulo: string }[] = [
  { valor: 'POS_OPERATORIO', rotulo: 'Pós-operatório' },
  { valor: 'MEDICACAO', rotulo: 'Medicação' },
  { valor: 'ORIENTACAO', rotulo: 'Orientação' },
  { valor: 'RETORNO', rotulo: 'Retorno' },
];

export const TAMANHO_MAXIMO_CONTEUDO = 2000;

export function rotuloDaCategoria(categoria: CategoriaMensagem) {
  return CATEGORIAS_MENSAGEM.find((c) => c.valor === categoria)?.rotulo ?? categoria;
}

export function validarNovaMensagem(
  idPet: number,
  categoria: CategoriaMensagem,
  assunto: string,
  conteudo: string
): Validacao<NovaMensagem> {
  if (!assunto.trim()) {
    return { ok: false, erro: 'Digite o assunto da mensagem.' };
  }
  if (conteudo.trim().length < 10) {
    return { ok: false, erro: 'Escreva uma orientação com pelo menos 10 caracteres.' };
  }
  if (conteudo.length > TAMANHO_MAXIMO_CONTEUDO) {
    return { ok: false, erro: `A mensagem pode ter no máximo ${TAMANHO_MAXIMO_CONTEUDO} caracteres.` };
  }
  return { ok: true, valor: { idPet, categoria, assunto: assunto.trim(), conteudo: conteudo.trim() } };
}

export function mensagensNovas(mensagens: Mensagem[], idsJaAvisados: Set<string>) {
  return mensagens.filter((mensagem) => !mensagem.lida && !idsJaAvisados.has(mensagem.id));
}
