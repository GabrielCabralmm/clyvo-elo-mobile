import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PawPrint, Trash2, Calendar, ChevronLeft, Check } from 'lucide-react-native';
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Pressable onPress={() => router.back()} style={styles.voltar}>
        <ChevronLeft color={colors.text} size={22} />
      </Pressable>

      <View style={styles.avatarGrande}>
        <PawPrint color={colors.green} size={36} />
      </View>

      <Text style={styles.nome}>{pet.nome}</Text>
      <Text style={styles.especie}>{pet.raca ?? pet.especie}</Text>

      <View style={styles.cartao}>
        <Text style={styles.linhaLabel}>Espécie</Text>
        <Text style={styles.linhaValor}>{pet.especie}</Text>
      </View>

      <View style={styles.cartao}>
        <Text style={styles.linhaLabel}>Peso</Text>
        {editandoPeso ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Pressable style={styles.botaoEventos} onPress={() => router.push(`/eventos/${idPet}`)}>
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
  voltar: { marginBottom: 12 },
  avatarGrande: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  nome: { fontSize: 20, fontWeight: '600', color: colors.text, textAlign: 'center' },
  especie: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  cartao: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
  },
  linhaLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  linhaValor: { fontSize: 15, color: colors.text, fontWeight: '500' },
  inputPeso: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGreen,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 2,
  },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  botaoEventos: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  botaoEventosTexto: { color: colors.white, fontSize: 14, fontWeight: '600' },
  botaoExcluir: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  botaoExcluirTexto: { color: colors.danger, fontSize: 14, fontWeight: '500' },
});
