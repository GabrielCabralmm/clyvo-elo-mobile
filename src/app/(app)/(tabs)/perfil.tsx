import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { LogOut, ShieldCheck } from 'lucide-react-native';
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
      <Image source={require('../../../../assets/images/clyvo-mark.png')} style={styles.marca} resizeMode="contain" />

      <View style={styles.cartao}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetra}>{nome?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nome}>{nome}</Text>

        <View style={styles.badge}>
          <ShieldCheck color={colors.green} size={14} />
          <Text style={styles.badgeTexto}>{papel}</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botaoSair, pressed && styles.botaoSairPressionado]}
        onPress={fazerLogout}
      >
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
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  marca: { width: 56, height: 52, marginBottom: 28 },
  cartao: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.cardBg,
    shadowColor: colors.darkGreen,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 32,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarLetra: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.green,
  },
  nome: { fontSize: 18, fontWeight: '700', color: colors.text },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },
  badgeTexto: { fontSize: 12, color: colors.darkGreen, fontWeight: '600' },
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
  botaoSairPressionado: { opacity: 0.8 },
  botaoSairTexto: { color: colors.danger, fontSize: 14, fontWeight: '500' },
});
