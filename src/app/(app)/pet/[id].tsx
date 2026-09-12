import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PawPrint, Cat, Trash2, Calendar, ChevronLeft, Check, Scale, Tag } from 'lucide-react-native';
import { buscarPet, atualizarPeso, excluirPet } from '@/api/pets';
import { colors } from '@/theme/colors';

export default function DetalhePet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idPet = Number(id);
  const queryClient = useQueryClient();

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', idPet],
    queryFn: () => buscarPet(idPet),
  });

  const [novoPeso, setNovoPeso] = useState('');
  const [editandoPeso, setEditandoPeso] = useState(false);
  const [erro, setErro] = useState('');

  const mutacaoPeso = useMutation({
    mutationFn: (peso: number) => atualizarPeso(idPet, peso),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', idPet] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setEditandoPeso(false);
      setErro('');
    },
    onError: () => setErro('Não deu pra atualizar o peso.'),
  });

  const mutacaoExcluir = useMutation({
    mutationFn: () => excluirPet(idPet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      router.back();
    },
    onError: (erroRequisicao: any) => {
      if (erroRequisicao?.response?.status === 409) {
        setErro('Esse pet tem eventos, dispositivos ou alertas vinculados — não dá pra excluir.');
      } else {
        setErro('Não deu pra excluir agora.');
      }
    },
  });

  function confirmarExclusao() {
    Alert.alert('Excluir pet', `Tem certeza que quer excluir ${pet?.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => mutacaoExcluir.mutate() },
    ]);
  }

  if (isLoading || !pet) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  const IconePet = pet.especie?.toUpperCase() === 'GATO' ? Cat : PawPrint;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Pressable onPress={() => router.back()} style={styles.voltar} hitSlop={8}>
        <ChevronLeft color={colors.text} size={22} />
      </Pressable>

      <View style={styles.topo}>
        <View style={styles.avatarGrande}>
          <IconePet color={colors.green} size={38} />
        </View>
        <Text style={styles.nome}>{pet.nome}</Text>
        <Text style={styles.especie}>{pet.raca ?? pet.especie}</Text>
      </View>

      <View style={styles.cartao}>
        <View style={styles.linhaIcone}>
          <Tag color={colors.lightGreen} size={16} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.linhaLabel}>Espécie</Text>
          <Text style={styles.linhaValor}>{pet.especie}</Text>
        </View>
      </View>

      <View style={styles.cartao}>
        <View style={styles.linhaIcone}>
          <Scale color={colors.lightGreen} size={16} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.linhaLabel}>Peso</Text>
          {editandoPeso ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <TextInput
                style={styles.inputPeso}
                keyboardType="decimal-pad"
                value={novoPeso}
                onChangeText={setNovoPeso}
                placeholder="kg"
                autoFocus
              />
              <Pressable
                onPress={() => {
                  const valor = Number(novoPeso.replace(',', '.'));
                  if (!valor || valor <= 0) {
                    setErro('Digita um peso válido.');
                    return;
                  }
                  mutacaoPeso.mutate(valor);
                }}
                hitSlop={8}
              >
                <Check color={colors.green} size={20} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => {
                setNovoPeso(String(pet.pesoKg ?? ''));
                setEditandoPeso(true);
              }}
            >
              <Text style={styles.linhaValor}>{pet.pesoKg ? `${pet.pesoKg} kg` : 'Adicionar'}</Text>
            </Pressable>
          )}
        </View>
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Pressable
        style={({ pressed }) => [styles.botaoEventos, pressed && styles.botaoPressionado]}
        onPress={() => router.push(`/eventos/${idPet}`)}
      >
        <Calendar color={colors.white} size={18} />
        <Text style={styles.botaoEventosTexto}>Ver eventos clínicos</Text>
      </Pressable>

      <Pressable style={styles.botaoExcluir} onPress={confirmarExclusao} disabled={mutacaoExcluir.isPending}>
        {mutacaoExcluir.isPending ? (
          <ActivityIndicator color={colors.danger} size="small" />
        ) : (
          <>
            <Trash2 color={colors.danger} size={18} />
            <Text style={styles.botaoExcluirTexto}>Excluir pet</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.offWhite },
  voltar: { marginBottom: 8 },
  topo: { alignItems: 'center', marginBottom: 24 },
  avatarGrande: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  nome: { fontSize: 21, fontWeight: '700', color: colors.text, textAlign: 'center' },
  especie: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  cartao: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
    shadowColor: colors.darkGreen,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  linhaIcone: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  linhaValor: { fontSize: 15, color: colors.text, fontWeight: '600' },
  inputPeso: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGreen,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 2,
  },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12, marginTop: 4 },
  botaoEventos: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: colors.green,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  botaoPressionado: { opacity: 0.85 },
  botaoEventosTexto: { color: colors.white, fontSize: 14, fontWeight: '600' },
  botaoExcluir: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  botaoExcluirTexto: { color: colors.danger, fontSize: 14, fontWeight: '500' },
});
