import { ComponentType } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

interface Props extends TextInputProps {
  icone?: ComponentType<{ color: string; size: number }>;
  rotulo?: string;
}

export function CampoTexto({ icone: Icone, rotulo, multiline, style, ...propriedades }: Props) {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);

  return (
    <View style={estilos.grupo}>
      {rotulo ? <Text style={estilos.rotulo}>{rotulo}</Text> : null}
      <View style={[estilos.campo, multiline && estilos.campoMultilinha]}>
        {Icone ? <Icone color={cores.textoSecundario} size={18} /> : null}
        <TextInput
          placeholderTextColor={cores.textoSecundario}
          multiline={multiline}
          style={[estilos.entrada, multiline && estilos.entradaMultilinha, style]}
          {...propriedades}
        />
      </View>
    </View>
  );
}

const criarEstilos = (cores: Paleta) => ({
  grupo: { marginBottom: 12 },
  rotulo: { fontSize: 13, fontWeight: '600' as const, color: cores.texto, marginBottom: 6 },
  campo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    backgroundColor: cores.superficie,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  campoMultilinha: { alignItems: 'flex-start' as const, paddingTop: 4 },
  entrada: { flex: 1, paddingVertical: 14, fontSize: 15, color: cores.texto },
  entradaMultilinha: { minHeight: 110, textAlignVertical: 'top' as const },
});
