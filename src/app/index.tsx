import { Redirect } from 'expo-router';
import { Carregando } from '@/components/Carregando';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { token, carregando } = useAuth();

  if (carregando) {
    return <Carregando telaCheia />;
  }

  return <Redirect href={token ? '/(app)/(tabs)' : '/(auth)/login'} />;
}
