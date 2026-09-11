import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

export default function Cadastro() {
  const { cadastrarComoTutor } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preenche nome, email e senha.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await cadastrarComoTutor({ nome, email, senha, telefone: telefone || undefined });
      router.replace('/(app)');
    } catch (erroRequisicao: any) {
      if (erroRequisicao?.response?.status === 409) {
        setErro('Já existe uma conta com esse email.');
      } else {
        setErro('Não deu pra cadastrar agora. Tenta de novo em instantes.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={styles.titulo}>CLYVO Elo</Text>
      <Text style={styles.subtitulo}>Criar conta de Tutor</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor={colors.textSecondary}
        value={nome}
        onChangeText={setNome}
      />
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
        placeholder="Senha (mínimo 6 caracteres)"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone (opcional)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Pressable style={styles.botao} onPress={cadastrar} disabled={carregando}>
        {carregando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Criar conta</Text>}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  titulo: { fontSize: 26, fontWeight: '600', color: colors.darkGreen, textAlign: 'center' },
  subtitulo: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
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
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12 },
  botao: { backgroundColor: colors.green, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: colors.white, fontSize: 15, fontWeight: '600' },
  link: { color: colors.green, fontSize: 13, textAlign: 'center', marginTop: 18 },
});
