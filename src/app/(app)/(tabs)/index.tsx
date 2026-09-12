import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Bell, PawPrint, Cat, ChevronRight, Plus, HeartHandshake } from 'lucide-react-native';
import { listarPets, listarMeusPets } from '@/api/pets';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';
import { Pet } from '@/types';

function iconeDoPet(especie: string) {
  return especie?.toUpperCase() === 'GATO' ? Cat : PawPrint;
}

export default function Home() {
  const { nome, papel } = useAuth();
  const ehDoutor = papel === 'Doutor';

  const { data: pets, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['pets', papel],
    queryFn: ehDoutor ? listarPets : listarMeusPets,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacaoLabel}>Olá,</Text>
          <Text style={styles.saudacaoNome}>{nome}</Text>
        </View>
        <View style={styles.iconeCirculo}>
          <Bell color={colors.green} size={18} />
        </View>
      </View>

      <Text style={styles.secaoTitulo}>{ehDoutor ? 'Pacientes' : 'Meus pets'}</Text>

      {isLoading && <ActivityIndicator color={colors.green} style={{ marginTop: 20 }} />}
      {isError && <Text style={styles.erro}>Não deu pra carregar os pets agora.</Text>}

      <FlatList
        data={pets}
        keyExtractor={(item) => String(item.idPet)}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.green} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.vazioContainer}>
              <View style={styles.vazioIcone}>
                <HeartHandshake color={colors.lightGreen} size={30} />
              </View>
              <Text style={styles.vazioTitulo}>{ehDoutor ? 'Nenhum paciente ainda' : 'Nenhum pet por aqui'}</Text>
              <Text style={styles.vazioTexto}>
                {ehDoutor ? 'Os pets cadastrados pelos tutores vão aparecer aqui.' : 'Toca no + para cadastrar o primeiro.'}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }: { item: Pet }) => {
          const IconePet = iconeDoPet(item.especie);
          return (
            <Pressable
              style={({ pressed }) => [styles.cartao, pressed && styles.cartaoPressionado]}
              onPress={() => router.push(`/pet/${item.idPet}`)}
            >
              <View style={styles.avatar}>
                <IconePet color={colors.green} size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.petNome}>{item.nome}</Text>
                <Text style={styles.petDetalhe}>
                  {item.raca ?? item.especie}
                  {item.pesoKg ? ` · ${item.pesoKg} kg` : ''}
                </Text>
              </View>
              <ChevronRight color={colors.lightGreen} size={18} />
            </Pressable>
          );
        }}
      />

      {!ehDoutor && (
        <Pressable
          style={({ pressed }) => [styles.botaoNovo, pressed && styles.botaoNovoPressionado]}
          onPress={() => router.push('/pet/novo')}
        >
          <Plus color={colors.white} size={22} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  saudacaoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  saudacaoNome: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  iconeCirculo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  erro: {
    color: colors.danger,
    fontSize: 13,
  },
  cartao: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
    shadowColor: colors.darkGreen,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cartaoPressionado: {
    opacity: 0.8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petNome: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  petDetalhe: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vazioContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  vazioIcone: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  vazioTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  vazioTexto: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  botaoNovo: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  botaoNovoPressionado: {
    opacity: 0.85,
  },
});
