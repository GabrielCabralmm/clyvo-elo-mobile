import { ComponentType, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';
import { Cartao } from './Cartao';

interface Props {
  icone: ComponentType<{ color: string; size: number }>;
  rotulo: string;
  valor?: string;
  children?: ReactNode;
  aoPressionar?: () => void;
}

export function LinhaDeInformacao({ icone: Icone, rotulo, valor, children, aoPressionar }: Props) {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);

  return (
    <Cartao aoPressionar={aoPressionar} estilo={estilos.linha}>
      <View style={estilos.icone}>
        <Icone color={cores.destaque} size={16} />
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
        {valor !== undefined ? <Text style={estilos.valor}>{valor}</Text> : null}
        {children}
      </View>
    </Cartao>
  );
}

const criarEstilos = (cores: Paleta) => ({
  linha: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  icone: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: cores.superficieSuave,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  textos: { flex: 1 },
  rotulo: { fontSize: 12, color: cores.textoSecundario },
  valor: { fontSize: 15, fontWeight: '600' as const, color: cores.texto, marginTop: 2 },
});
