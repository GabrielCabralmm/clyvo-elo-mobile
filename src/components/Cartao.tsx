import { ReactNode } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

interface Props {
  children: ReactNode;
  aoPressionar?: () => void;
  estilo?: ViewStyle;
}

export function Cartao({ children, aoPressionar, estilo }: Props) {
  const estilos = useEstilos(criarEstilos);

  if (!aoPressionar) {
    return <View style={[estilos.cartao, estilo]}>{children}</View>;
  }

  return (
    <Pressable onPress={aoPressionar} style={({ pressed }) => [estilos.cartao, estilo, pressed && estilos.pressionado]}>
      {children}
    </Pressable>
  );
}

const criarEstilos = (cores: Paleta) => ({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    shadowColor: cores.sombra,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  pressionado: { opacity: 0.8 },
});
