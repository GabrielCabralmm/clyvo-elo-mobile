import { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

export interface OpcaoDoSeletor<T> {
  valor: T;
  rotulo: string;
  icone?: ComponentType<{ color: string; size: number }>;
}

interface Props<T> {
  opcoes: OpcaoDoSeletor<T>[];
  valor: T;
  aoMudar: (valor: T) => void;
  rotulo?: string;
  emGrade?: boolean;
}

export function Seletor<T extends string | number>({ opcoes, valor, aoMudar, rotulo, emGrade = false }: Props<T>) {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);

  return (
    <View style={estilos.grupo}>
      {rotulo ? <Text style={estilos.rotulo}>{rotulo}</Text> : null}
      <View style={[estilos.linha, emGrade && estilos.grade]}>
        {opcoes.map((opcao) => {
          const ativa = opcao.valor === valor;
          const Icone = opcao.icone;
          return (
            <Pressable
              key={String(opcao.valor)}
              accessibilityRole="button"
              accessibilityState={{ selected: ativa }}
              onPress={() => aoMudar(opcao.valor)}
              style={[estilos.opcao, emGrade && estilos.opcaoGrade, ativa && estilos.opcaoAtiva]}
            >
              {Icone ? <Icone color={ativa ? cores.textoSobrePrimaria : cores.primaria} size={16} /> : null}
              <Text style={[estilos.texto, ativa && estilos.textoAtivo]}>{opcao.rotulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const criarEstilos = (cores: Paleta) => ({
  grupo: { marginBottom: 14 },
  rotulo: { fontSize: 13, fontWeight: '600' as const, color: cores.texto, marginBottom: 8 },
  linha: {
    flexDirection: 'row' as const,
    backgroundColor: cores.superficieSuave,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  grade: { flexWrap: 'wrap' as const, backgroundColor: 'transparent', padding: 0, gap: 8 },
  opcao: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  opcaoGrade: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto' as const,
    paddingHorizontal: 14,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  opcaoAtiva: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  texto: { fontSize: 13, fontWeight: '600' as const, color: cores.textoSecundario },
  textoAtivo: { color: cores.textoSobrePrimaria },
});
