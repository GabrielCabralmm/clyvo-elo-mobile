import { useEffect } from 'react';
import { router } from 'expo-router';
import { aoTocarNaNotificacao, configurarNotificacoes } from '@/lib/notificacoes';

export function useAberturaPorNotificacao() {
  useEffect(() => {
    configurarNotificacoes();
    return aoTocarNaNotificacao((rota) => router.push(rota as never));
  }, []);
}
