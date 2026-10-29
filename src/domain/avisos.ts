import { EventoClinico, Mensagem } from '@/types';
import { AvisoLocal, LembreteAgendado } from '@/lib/notificacoes.types';
import { rotuloDoTipo } from './eventos';
import { formatarData } from './datas';

export const HORA_DO_LEMBRETE = 9;
export const LIMITE_DE_AVISOS_INDIVIDUAIS = 3;

export function avisosDeMensagens(novas: Mensagem[]): AvisoLocal[] {
  if (novas.length > LIMITE_DE_AVISOS_INDIVIDUAIS) {
    return [
      {
        titulo: 'Novas orientações da clínica',
        corpo: `Você tem ${novas.length} mensagens novas da equipe veterinária.`,
        rota: '/mensagens',
      },
    ];
  }
  return novas.map((mensagem) => ({
    titulo: `${mensagem.nomeDoutor} enviou uma orientação`,
    corpo: `${mensagem.nomePet}: ${mensagem.assunto}`,
    rota: `/mensagens/${mensagem.id}`,
  }));
}

export function avisosDeEventosNovos(novos: EventoClinico[], nomeDoPet: (idPet: number) => string): AvisoLocal[] {
  return novos.map((evento) => ({
    titulo: `Novo cuidado agendado para ${nomeDoPet(evento.idPet)}`,
    corpo: `${rotuloDoTipo(evento.tipoEvento)} em ${formatarData(evento.dataEvento)}${evento.nomeDoutor ? ` com ${evento.nomeDoutor}` : ''}.`,
    rota: `/eventos/${evento.idPet}`,
  }));
}

export function lembretesDeEventos(eventos: EventoClinico[], nomeDoPet: (idPet: number) => string): LembreteAgendado[] {
  return eventos.map((evento) => {
    const quando = new Date(evento.dataEvento);
    quando.setHours(HORA_DO_LEMBRETE, 0, 0, 0);
    return {
      identificador: String(evento.idEvento),
      quando,
      titulo: `Hoje: ${rotuloDoTipo(evento.tipoEvento).toLowerCase()} de ${nomeDoPet(evento.idPet)}`,
      corpo: evento.descricao ? evento.descricao : 'Confira o horário com a clínica e leve o histórico do pet.',
      rota: `/eventos/${evento.idPet}`,
    };
  });
}
