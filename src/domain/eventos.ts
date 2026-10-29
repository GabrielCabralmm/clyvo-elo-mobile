import { EventoClinico, StatusEvento, TipoEvento } from '@/types';
import { dataLocalSemFuso, diasAte } from './datas';

export const TIPOS_EVENTO: { valor: TipoEvento; rotulo: string }[] = [
  { valor: 'VACINA', rotulo: 'Vacina' },
  { valor: 'CHECKUP', rotulo: 'Check-up' },
  { valor: 'POS_OPERATORIO', rotulo: 'Pós-operatório' },
  { valor: 'MEDICACAO', rotulo: 'Medicação' },
  { valor: 'EXAME', rotulo: 'Exame' },
];

export const ROTULO_STATUS: Record<StatusEvento, string> = {
  PENDENTE: 'Pendente',
  CONCLUIDO: 'Concluído',
  ATRASADO: 'Atrasado',
};

export const OPCOES_DE_DATA = [
  { rotulo: 'Hoje', dias: 0 },
  { rotulo: 'Amanhã', dias: 1 },
  { rotulo: 'Em 7 dias', dias: 7 },
  { rotulo: 'Em 15 dias', dias: 15 },
  { rotulo: 'Em 30 dias', dias: 30 },
];

export function rotuloDoTipo(tipo: TipoEvento) {
  return TIPOS_EVENTO.find((t) => t.valor === tipo)?.rotulo ?? tipo;
}

export function situacaoDoEvento(evento: EventoClinico): StatusEvento {
  if (evento.status === 'PENDENTE' && diasAte(evento.dataEvento) < 0) {
    return 'ATRASADO';
  }
  return evento.status;
}

export function proximoStatus(status: StatusEvento): StatusEvento {
  return status === 'CONCLUIDO' ? 'PENDENTE' : 'CONCLUIDO';
}

export function dataDaqui(dias: number, hoje = new Date()) {
  const data = new Date(hoje);
  data.setDate(data.getDate() + dias);
  return dataLocalSemFuso(data);
}

export function eventosParaLembrar(eventos: EventoClinico[]) {
  return eventos.filter((evento) => evento.status === 'PENDENTE' && diasAte(evento.dataEvento) >= 0);
}

export const TOM_DO_STATUS: Record<StatusEvento, 'neutro' | 'sucesso' | 'atencao' | 'perigo'> = {
  PENDENTE: 'atencao',
  CONCLUIDO: 'sucesso',
  ATRASADO: 'perigo',
};
