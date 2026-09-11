import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
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
    } catch {
      setErro('Email ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>CLYVO Elo</Text>
      <Text style={styles.subtitulo}>Entrar</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Pressable style={styles.botao} onPress={entrar} disabled={carregando}>
        {carregando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Entrar</Text>}
      </Pressable>

      <Pressable onPress={() => router.push('/(auth)/cadastro')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.darkGreen,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
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
  },
  opcaoTexto: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  opcaoTextoAtivo: {
    color: colors.white,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBg,
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
