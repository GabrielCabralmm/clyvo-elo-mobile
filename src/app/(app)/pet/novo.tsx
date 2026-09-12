import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, PawPrint, Tag } from 'lucide-react-native';
import { criarPet } from '@/api/pets';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

export default function NovoPet() {
  const { id: idTutor } = useAuth();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<'CACHORRO' | 'GATO'>('CACHORRO');
  const [raca, setRaca] = useState('');
  const [erro, setErro] = useState('');

  const mutacao = useMutation({
    mutationFn: criarPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      router.back();
    },
    onError: () => setErro('Não deu pra cadastrar o pet agora.'),
  });

  function salvar() {
    if (!nome.trim()) {
      setErro('Digita o nome do pet.');
      return;
    }
    if (!idTutor) {
      setErro('Sessão inválida, faz login de novo.');
      return;
    }
    setErro('');
    mutacao.mutate({ idTutor, nome, especie, raca: raca || undefined });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Novo pet</Text>
          <Text style={styles.subtitulo}>Cadastra em segundos</Text>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.fechar}>
          <X color={colors.textSecondary} size={20} />
        </Pressable>
      </View>

      <View style={styles.campo}>
        <PawPrint color={colors.textSecondary} size={18} />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor={colors.textSecondary}
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.seletor}>
        <Pressable
          style={[styles.opcao, especie === 'CACHORRO' && styles.opcaoAtiva]}
          onPress={() => setEspecie('CACHORRO')}
        >
          <Text style={[styles.opcaoTexto, especie === 'CACHORRO' && styles.opcaoTextoAtivo]}>Cachorro</Text>
        </Pressable>
        <Pressable
          style={[styles.opcao, especie === 'GATO' && styles.opcaoAtiva]}
          onPress={() => setEspecie('GATO')}
        >
          <Text style={[styles.opcaoTexto, especie === 'GATO' && styles.opcaoTextoAtivo]}>Gato</Text>
        </Pressable>
      </View>

      <View style={styles.campo}>
        <Tag color={colors.textSecondary} size={18} />
        <TextInput
          style={styles.input}
          placeholder="Raça (opcional)"
          placeholderTextColor={colors.textSecondary}
          value={raca}
          onChangeText={setRaca}
        />
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={salvar}
        disabled={mutacao.isPending}
      >
        {mutacao.isPending ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Salvar</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite, padding: 20, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  titulo: { fontSize: 19, fontWeight: '700', color: colors.text },
  subtitulo: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  fechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
    shadowColor: colors.darkGreen,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: colors.text },
  seletor: { flexDirection: 'row', backgroundColor: colors.cardBg, borderRadius: 14, padding: 4, marginBottom: 12 },
  opcao: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  opcaoAtiva: {
    backgroundColor: colors.green,
    shadowColor: colors.darkGreen,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  opcaoTexto: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  opcaoTextoAtivo: { color: colors.white },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  botao: {
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.green,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  botaoPressionado: { opacity: 0.85 },
  botaoTexto: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
