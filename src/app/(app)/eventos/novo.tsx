import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Syringe, Stethoscope, Scissors, Pill, Microscope } from 'lucide-react-native';
import { criarEvento } from '@/api/eventos';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

const TIPOS = [
  { valor: 'VACINA', rotulo: 'Vacina', icone: Syringe },
  { valor: 'CHECKUP', rotulo: 'Check-up', icone: Stethoscope },
  { valor: 'POS_OPERATORIO', rotulo: 'Pós-operatório', icone: Scissors },
  { valor: 'MEDICACAO', rotulo: 'Medicação', icone: Pill },
  { valor: 'EXAME', rotulo: 'Exame', icone: Microscope },
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
        <View>
          <Text style={styles.titulo}>Novo evento clínico</Text>
          <Text style={styles.subtitulo}>Registra o cuidado de hoje</Text>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.fechar}>
          <X color={colors.textSecondary} size={20} />
        </Pressable>
      </View>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.grade}>
        {TIPOS.map((tipo) => {
          const ativo = tipoEvento === tipo.valor;
          const Icone = tipo.icone;
          return (
            <Pressable
              key={tipo.valor}
              style={[styles.opcao, ativo && styles.opcaoAtiva]}
              onPress={() => setTipoEvento(tipo.valor)}
            >
              <Icone color={ativo ? colors.white : colors.green} size={18} />
              <Text style={[styles.opcaoTexto, ativo && styles.opcaoTextoAtivo]}>{tipo.rotulo}</Text>
            </Pressable>
          );
        })}
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

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={salvar}
        disabled={mutacao.isPending}
      >
        {mutacao.isPending ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Registrar</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 },
  titulo: { fontSize: 18, fontWeight: '700', color: colors.text },
  subtitulo: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  fechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 10, fontWeight: '500' },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
  },
  opcaoAtiva: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    shadowColor: colors.green,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
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
    minHeight: 90,
    textAlignVertical: 'top',
  },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  botao: {
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  botaoPressionado: { opacity: 0.85 },
  botaoTexto: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
