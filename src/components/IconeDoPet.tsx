import { View } from 'react-native';
import { Cat, PawPrint } from 'lucide-react-native';
import { useTema } from '@/contexts/TemaContext';
import { ehGato } from '@/domain/pets';

export function IconeDoPet({ especie, tamanho = 48 }: { especie: string; tamanho?: number }) {
  const { cores } = useTema();
  const Icone = ehGato(especie) ? Cat : PawPrint;
  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: cores.superficieSuave,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icone color={cores.primaria} size={tamanho * 0.46} />
    </View>
  );
}
