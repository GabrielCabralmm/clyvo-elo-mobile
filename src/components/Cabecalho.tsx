import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, X } from 'lucide-react-native';
import { useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

interface Props {
  titulo: string;
  subtitulo?: string;
  voltar?: 'seta' | 'fechar';
  direita?: ReactNode;
}

export function Cabecalho({ titulo, subtitulo, voltar, direita }: Props) {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);
  const IconeVoltar = voltar === 'fechar' ? X : ChevronLeft;

  return (
    <View style={estilos.linha}>
      {voltar === 'seta' && (
        <Pressable onPress={() => router.back()} hitSlop={10} style={estilos.botaoVoltar} accessibilityLabel="Voltar">
          <IconeVoltar color={cores.texto} size={22} />
        </Pressable>
      )}
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
      </View>
      {direita}
      {voltar === 'fechar' && (
        <Pressable onPress={() => router.back()} hitSlop={10} style={estilos.botaoFechar} accessibilityLabel="Fechar">
          <IconeVoltar color={cores.textoSecundario} size={20} />
        </Pressable>
      )}
    </View>
  );
}

const criarEstilos = (cores: Paleta) => ({
  linha: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, marginBottom: 20 },
  botaoVoltar: { padding: 2 },
  textos: { flex: 1 },
  titulo: { fontSize: 20, fontWeight: '700' as const, color: cores.titulo },
  subtitulo: { fontSize: 13, color: cores.textoSecundario, marginTop: 2 },
  botaoFechar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.superficieSuave,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
});
