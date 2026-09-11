import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout() {
  const { token, carregando } = useAuth();

  if (carregando) {
    return null;
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pet/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="pet/novo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="eventos/[idPet]" options={{ presentation: 'card' }} />
      <Stack.Screen name="eventos/novo" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
