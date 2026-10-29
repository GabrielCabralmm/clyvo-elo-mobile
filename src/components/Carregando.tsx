import { ActivityIndicator, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';

export function Carregando({ telaCheia = false }: { telaCheia?: boolean }) {
  const { cores } = useTema();
  return (
    <View
      style={
        telaCheia
          ? { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo }
          : { paddingVertical: 20 }
      }
    >
      <ActivityIndicator color={cores.primaria} />
    </View>
  );
}
