import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

export default function Login() {
  const { entrarComoTutor, entrarComoDoutor } = useAuth();
  const [papel, setPapel] = useState<'Tutor' | 'Doutor'>('Tutor');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function entrar() {
    if (!email || !senha) {
      setErro('Preenche email e senha.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      if (papel === 'Tutor') {
        await entrarComoTutor(email, senha);
      } else {
        await entrarComoDoutor(email, senha);
      }
      router.replace('/(app)');
    } catch (erroRequisicao: any) {
      if (erroRequisicao?.response?.status === 401) {
        setErro('Email ou senha inválidos.');
      } else {
        setErro('Não deu pra falar com o servidor. Se for a primeira tentativa, espera uns 30s e tenta de novo.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../../../assets/images/clyvo-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitulo}>Continuidade de cuidado, do consultório para casa</Text>

        <View style={styles.seletor}>
          <Pressable
            style={[styles.opcao, papel === 'Tutor' && styles.opcaoAtiva]}
            onPress={() => setPapel('Tutor')}
          >
            <Text style={[styles.opcaoTexto, papel === 'Tutor' && styles.opcaoTextoAtivo]}>Tutor</Text>
          </Pressable>
          <Pressable
            style={[styles.opcao, papel === 'Doutor' && styles.opcaoAtiva]}
            onPress={() => setPapel('Doutor')}
          >
            <Text style={[styles.opcaoTexto, papel === 'Doutor' && styles.opcaoTextoAtivo]}>Doutor</Text>
          </Pressable>
        </View>

        <View style={styles.campo}>
          <Mail color={colors.textSecondary} size={18} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.campo}>
          <Lock color={colors.textSecondary} size={18} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
          onPress={entrar}
          disabled={carregando}
        >
          {carregando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Entrar</Text>}
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/cadastro')} hitSlop={8}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.offWhite },
  container: {
    flexGrow: 1,
    backgroundColor: colors.offWhite,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 210,
    alignSelf: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  seletor: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  opcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  opcaoAtiva: {
    backgroundColor: colors.green,
    shadowColor: colors.darkGreen,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  opcaoTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  opcaoTextoAtivo: {
    color: colors.white,
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
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  erro: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
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
  botaoPressionado: {
    opacity: 0.85,
  },
  botaoTexto: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  link: {
    color: colors.green,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 18,
  },
});
