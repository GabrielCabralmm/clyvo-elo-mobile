import { Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTema } from '@/contexts/TemaContext';

export function BotaoFlutuante({ aoPressionar, rotulo }: { aoPressionar: () => void; rotulo: string }) {
  const { cores } = useTema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={aoPressionar}
      style={({ pressed }) => ({
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: cores.primaria,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
        shadowColor: cores.primaria,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      })}
    >
      <Plus color={cores.textoSobrePrimaria} size={24} />
    </Pressable>
  );
}
