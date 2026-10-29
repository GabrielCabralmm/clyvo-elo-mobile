import { ReactNode } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

interface Props {
  children: ReactNode;
  rolavel?: boolean;
  estiloConteudo?: ViewStyle;
}

export function Tela({ children, rolavel = false, estiloConteudo }: Props) {
  const estilos = useEstilos(criarEstilos);

  return (
    <SafeAreaView style={estilos.fundo} edges={['top']}>
      {rolavel ? (
        <ScrollView contentContainerStyle={[estilos.conteudo, estiloConteudo]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[estilos.conteudo, estilos.preencher, estiloConteudo]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const criarEstilos = (cores: Paleta) => ({
  fundo: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 32, width: '100%' as const, maxWidth: 720, alignSelf: 'center' as const },
  preencher: { flex: 1 },
});
