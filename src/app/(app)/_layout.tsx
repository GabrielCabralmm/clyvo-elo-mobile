import { Redirect, Stack } from 'expo-router';
import { Carregando } from '@/components/Carregando';
import { useAuth } from '@/contexts/AuthContext';
import { useTema } from '@/contexts/TemaContext';
import { useAberturaPorNotificacao } from '@/hooks/useAberturaPorNotificacao';
import { useCentralDeAvisos } from '@/hooks/useCentralDeAvisos';

export default function AppLayout() {
  const { token, carregando } = useAuth();
  const { cores } = useTema();
  useAberturaPorNotificacao();
  useCentralDeAvisos();

  if (carregando) {
    return <Carregando telaCheia />;
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pet/[id]" />
      <Stack.Screen name="pet/novo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="eventos/[idPet]" />
      <Stack.Screen name="eventos/novo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="mensagens/[id]" />
      <Stack.Screen name="mensagens/nova" options={{ presentation: 'modal' }} />
      <Stack.Screen name="sobre" />
    </Stack>
  );
}
