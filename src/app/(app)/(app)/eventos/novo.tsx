import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react-native';
import { criarEvento } from '@/api/eventos';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

const TIPOS = [
  { valor: 'VACINA', rotulo: 'Vacina' },
  { valor: 'CHECKUP', rotulo: 'Check-up' },
  { valor: 'POS_OPERATORIO', rotulo: 'Pós-operatório' },
  { valor: 'MEDICACAO', rotulo: 'Medicação' },
  { valor: 'EXAME', rotulo: 'Exame' },
];

export default function NovoEvento() {
  const { idPet } = useLocalSearchParams<{ idPet: string }>();
  const { id: idDoutor } = useAuth();
  const queryClient = useQueryClient();

  const [tipoEvento, setTipoEvento] = useState('CHECKUP');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');

  const mutacao = useMutation({
    mutationFn: criarEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', Number(idPet)] });
      router.back();
    },
    onError: () => setErro('Não deu pra registrar o evento agora.'),
  });

  function salvar() {
    if (!idDoutor) {
      setErro('Sessão inválida, faz login de novo.');
      return;
    }
    setErro('');
    mutacao.mutate({
      idPet: Number(idPet),
      idDoutor,
      tipoEvento,
      descricao: descricao || undefined,
      dataEvento: new Date().toISOString(),
      status: 'PENDENTE',
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Novo evento clínico</Text>
        <Pressable onPress={() => router.back()}>
          <X color={colors.textSecondary} size={22} />
        </Pressable>
      </View>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.opcoes}>
        {TIPOS.map((tipo) => (
          <Pressable
            key={tipo.valor}
            style={[styles.opcao, tipoEvento === tipo.valor && styles.opcaoAtiva]}
            onPress={() => setTipoEvento(tipo.valor)}
          >
            <Text style={[styles.opcaoTexto, tipoEvento === tipo.valor && styles.opcaoTextoAtivo]}>
              {tipo.rotulo}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Descrição (opcional)"
        placeholderTextColor={colors.textSecondary}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Pressable style={styles.botao} onPress={salvar} disabled={mutacao.isPending}>
        {mutacao.isPending ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Registrar</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  titulo: { fontSize: 18, fontWeight: '600', color: colors.text },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  opcao: { backgroundColor: colors.cardBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  opcaoAtiva: { backgroundColor: colors.green },
  opcaoTexto: { fontSize: 13, color: colors.text, fontWeight: '500' },
  opcaoTextoAtivo: { color: colors.white },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBg,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  botao: { backgroundColor: colors.green, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  botaoTexto: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
