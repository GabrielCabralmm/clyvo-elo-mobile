import { ComponentType } from 'react';
import { Text, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

interface Props {
  icone: ComponentType<{ color: string; size: number }>;
  titulo: string;
  texto: string;
}

export function EstadoVazio({ icone: Icone, titulo, texto }: Props) {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);

  return (
    <View style={estilos.container}>
      <View style={estilos.icone}>
        <Icone color={cores.destaque} size={30} />
      </View>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const criarEstilos = (cores: Paleta) => ({
  container: { alignItems: 'center' as const, paddingTop: 48, paddingHorizontal: 32 },
  icone: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.superficieSuave,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 16,
  },
  titulo: { fontSize: 15, fontWeight: '600' as const, color: cores.texto, marginBottom: 6, textAlign: 'center' as const },
  texto: { fontSize: 13, color: cores.textoSecundario, textAlign: 'center' as const },
});
