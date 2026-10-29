import { Text, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { Paleta } from '@/theme/paletas';

export type TomDaEtiqueta = 'neutro' | 'sucesso' | 'atencao' | 'perigo';

function coresDoTom(cores: Paleta, tom: TomDaEtiqueta) {
  switch (tom) {
    case 'sucesso':
      return { fundo: cores.sucessoSuave, texto: cores.sucesso };
    case 'atencao':
      return { fundo: cores.atencaoSuave, texto: cores.atencao };
    case 'perigo':
      return { fundo: cores.perigoSuave, texto: cores.perigo };
    default:
      return { fundo: cores.superficieSuave, texto: cores.titulo };
  }
}

export function Etiqueta({ texto, tom = 'neutro' }: { texto: string; tom?: TomDaEtiqueta }) {
  const { cores } = useTema();
  const { fundo, texto: corDoTexto } = coresDoTom(cores, tom);

  return (
    <View style={{ backgroundColor: fundo, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ color: corDoTexto, fontSize: 11, fontWeight: '600' }}>{texto}</Text>
    </View>
  );
}
