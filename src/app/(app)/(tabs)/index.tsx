import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Bell, PawPrint, ChevronRight, Plus } from 'lucide-react-native';
import { listarPets, listarMeusPets } from '@/api/pets';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';
import { Pet } from '@/types';

export default function Home() {
  const { nome, papel } = useAuth();
  const ehDoutor = papel === 'Doutor';

  const { data: pets, isLoading, isError } = useQuery({
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
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }: { item: Pet }) => (
          <Pressable
            style={styles.cartao}
            onPress={() => router.push(`/pet/${item.idPet}`)}
          >
            <View style={styles.avatar}>
              <PawPrint color={colors.green} size={22} />
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
        )}
      />

      {!ehDoutor && (
        <Pressable style={styles.botaoNovo} onPress={() => router.push('/pet/novo')}>
          <Plus color={colors.white} size={20} />
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
    fontSize: 19,
    fontWeight: '600',
    color: colors.text,
  },
  iconeCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
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
