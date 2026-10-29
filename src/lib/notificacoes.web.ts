import { AvisoLocal, LembreteAgendado } from './notificacoes.types';

let abrirRota: ((rota: string) => void) | null = null;

function navegadorSuporta() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function configurarNotificacoes() {}

export async function permissaoConcedida() {
  return navegadorSuporta() && Notification.permission === 'granted';
}

export async function pedirPermissao() {
  if (!navegadorSuporta()) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  return (await Notification.requestPermission()) === 'granted';
}

export async function avisarAgora({ titulo, corpo, rota }: AvisoLocal) {
  if (!(await permissaoConcedida())) {
    return;
  }
  const notificacao = new Notification(titulo, { body: corpo });
  notificacao.onclick = () => {
    window.focus();
    abrirRota?.(rota);
  };
}

export async function substituirLembretes(_lembretes: LembreteAgendado[]) {}

export async function cancelarTodosOsLembretes() {}

export function aoTocarNaNotificacao(abrir: (rota: string) => void) {
  abrirRota = abrir;
  return () => {
    abrirRota = null;
  };
}
