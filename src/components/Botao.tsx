import { ComponentType } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

type Variante = 'primario' | 'secundario' | 'perigo';

interface Props {
  titulo: string;
  aoPressionar: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
  icone?: ComponentType<{ color: string; size: number }>;
}

export function Botao({ titulo, aoPressionar, variante = 'primario', carregando = false, desabilitado = false, icone: Icone }: Props) {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);
  const corDoTexto = variante === 'primario' ? cores.textoSobrePrimaria : variante === 'perigo' ? cores.perigo : cores.primaria;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={aoPressionar}
      disabled={carregando || desabilitado}
      style={({ pressed }) => [estilos.base, estilos[variante], (pressed || desabilitado) && estilos.apagado]}
    >
      {carregando ? (
        <ActivityIndicator color={corDoTexto} />
      ) : (
        <>
          {Icone ? <Icone color={corDoTexto} size={18} /> : null}
          <Text style={[estilos.texto, { color: corDoTexto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const criarEstilos = (cores: Paleta) => ({
  base: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.borda },
  perigo: { backgroundColor: cores.superficie, borderWidth: 1, borderColor: cores.perigoSuave },
  apagado: { opacity: 0.7 },
  texto: { fontSize: 15, fontWeight: '600' as const },
});
