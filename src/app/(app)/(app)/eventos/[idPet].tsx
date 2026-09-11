import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import { listarEventosPorPet, atualizarStatusEvento, excluirEvento } from '@/api/eventos';
import { buscarPet } from '@/api/pets';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';
import { EventoClinico } from '@/types';

const TIPO_LABEL: Record<string, string> = {
  VACINA: 'Vacina',
  CHECKUP: 'Check-up',
  POS_OPERATORIO: 'Pós-operatório',
  MEDICACAO: 'Medicação',
  EXAME: 'Exame',
};

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONCLUIDO: 'Concluído',
  ATRASADO: 'Atrasado',
};

export default function EventosDoPet() {
  const { idPet } = useLocalSearchParams<{ idPet: string }>();
  const idPetNum = Number(idPet);
  const { papel } = useAuth();
  const queryClient = useQueryClient();
  const ehDoutor = papel === 'Doutor';

  const { data: pet } = useQuery({ queryKey: ['pet', idPetNum], queryFn: () => buscarPet(idPetNum) });
  const { data: eventos, isLoading } = useQuery({
    queryKey: ['eventos', idPetNum],
    queryFn: () => listarEventosPorPet(idPetNum),
  });

  const mutacaoStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => atualizarStatusEvento(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eventos', idPetNum] }),
  });

  const mutacaoExcluir = useMutation({
    mutationFn: (id: number) => excluirEvento(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eventos', idPetNum] }),
  });

  function confirmarExclusao(evento: EventoClinico) {
    Alert.alert('Excluir evento', `Excluir "${TIPO_LABEL[evento.tipoEvento] ?? evento.tipoEvento}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => mutacaoExcluir.mutate(evento.idEvento) },
    ]);
  }

  function proximoStatus(status: string) {
    return status === 'CONCLUIDO' ? 'PENDENTE' : 'CONCLUIDO';
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.titulo}>{pet ? `Eventos de ${pet.nome}` : 'Eventos clínicos'}</Text>
        <View style={{ width: 22 }} />
      </View>

      {isLoading && <ActivityIndicator color={colors.green} style={{ marginTop: 20 }} />}

      <FlatList
        data={eventos}
        keyExtractor={(item) => String(item.idEvento)}
        contentContainerStyle={{ padding: 20, paddingBottom: 90 }}
        ListEmptyComponent={!isLoading ? <Text style={styles.vazio}>Nenhum evento registrado ainda.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.cartao}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipo}>{TIPO_LABEL[item.tipoEvento] ?? item.tipoEvento}</Text>
              {item.descricao ? <Text style={styles.descricao}>{item.descricao}</Text> : null}
              <Text style={styles.data}>{new Date(item.dataEvento).toLocaleDateString('pt-BR')}</Text>
            </View>

            <View style={styles.acoes}>
              <Pressable
                style={[styles.status, item.status === 'CONCLUIDO' && styles.statusConcluido]}
                onPress={
                  ehDoutor
                    ? () => mutacaoStatus.mutate({ id: item.idEvento, status: proximoStatus(item.status) })
                    : undefined
                }
              >
                <Text style={[styles.statusTexto, item.status === 'CONCLUIDO' && styles.statusTextoConcluido]}>
                  {STATUS_LABEL[item.status] ?? item.status}
                </Text>
              </Pressable>
              {ehDoutor && (
                <Pressable onPress={() => confirmarExclusao(item)}>
                  <Trash2 color={colors.danger} size={16} />
                </Pressable>
              )}
            </View>
          </View>
        )}
      />

      {ehDoutor && (
        <Pressable style={styles.botaoNovo} onPress={() => router.push(`/eventos/novo?idPet=${idPetNum}`)}>
          <Plus color={colors.white} size={22} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titulo: { fontSize: 16, fontWeight: '600', color: colors.text },
  vazio: { textAlign: 'center', color: colors.textSecondary, fontSize: 14, marginTop: 40 },
  cartao: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipo: { fontSize: 15, fontWeight: '600', color: colors.text },
  descricao: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  data: { fontSize: 12, color: colors.lightGreen, marginTop: 4 },
  acoes: { alignItems: 'flex-end', gap: 8 },
  status: { backgroundColor: colors.cardBg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusConcluido: { backgroundColor: colors.green },
  statusTexto: { fontSize: 11, fontWeight: '600', color: colors.text },
  statusTextoConcluido: { color: colors.white },
  botaoNovo: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
