import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LogOut, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

export default function Perfil() {
  const { nome, papel, sair } = useAuth();

  async function fazerLogout() {
    await sair();
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <User color={colors.green} size={28} />
      </View>
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.papel}>{papel}</Text>

      <Pressable style={styles.botaoSair} onPress={fazerLogout}>
        <LogOut color={colors.danger} size={18} />
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  nome: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  papel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 32,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBg,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  botaoSairTexto: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
});
