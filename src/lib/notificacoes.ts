import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AvisoLocal, LembreteAgendado } from './notificacoes.types';

const CANAL_CUIDADOS = 'cuidados';
const PREFIXO_LEMBRETE = 'lembrete-';

export function configurarNotificacoes() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(CANAL_CUIDADOS, {
      name: 'Cuidados do pet',
      description: 'Orientações da clínica e lembretes de vacinas, retornos e medicações',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function permissaoConcedida() {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function pedirPermissao() {
  if (await permissaoConcedida()) {
    return true;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function avisarAgora({ titulo, corpo, rota }: AvisoLocal) {
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo, data: { rota } },
    trigger: Platform.OS === 'android' ? { channelId: CANAL_CUIDADOS } : null,
  });
}

export async function substituirLembretes(lembretes: LembreteAgendado[]) {
  const agendados = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    agendados
      .filter((n) => n.identifier.startsWith(PREFIXO_LEMBRETE))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  await Promise.all(
    lembretes
      .filter((lembrete) => lembrete.quando.getTime() > Date.now())
      .map((lembrete) =>
        Notifications.scheduleNotificationAsync({
          identifier: PREFIXO_LEMBRETE + lembrete.identificador,
          content: { title: lembrete.titulo, body: lembrete.corpo, data: { rota: lembrete.rota } },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: lembrete.quando,
            channelId: CANAL_CUIDADOS,
          },
        })
      )
  );
}

export async function cancelarTodosOsLembretes() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function aoTocarNaNotificacao(abrir: (rota: string) => void) {
  const assinatura = Notifications.addNotificationResponseReceivedListener((resposta) => {
    const rota = resposta.notification.request.content.data?.rota;
    if (typeof rota === 'string') {
      abrir(rota);
    }
  });

  Notifications.getLastNotificationResponseAsync().then((resposta) => {
    const rota = resposta?.notification.request.content.data?.rota;
    if (typeof rota === 'string') {
      abrir(rota);
    }
  });

  return () => assinatura.remove();
}
