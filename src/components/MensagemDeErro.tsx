import { Text } from 'react-native';
import { useTema } from '@/contexts/TemaContext';

export function MensagemDeErro({ texto }: { texto?: string | null }) {
  const { cores } = useTema();
  if (!texto) {
    return null;
  }
  return <Text style={{ color: cores.perigo, fontSize: 13, marginVertical: 8 }}>{texto}</Text>;
}
