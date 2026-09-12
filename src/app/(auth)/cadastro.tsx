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
import { ChevronLeft, User, Mail, Lock, Phone } from 'lucide-react-native';
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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.voltar} hitSlop={8}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <Image source={require('../../../assets/images/clyvo-mark.png')} style={styles.marca} resizeMode="contain" />
        <Text style={styles.titulo}>Criar conta de Tutor</Text>
        <Text style={styles.subtitulo}>Leva menos de um minuto</Text>

        <View style={styles.campo}>
          <User color={colors.textSecondary} size={18} />
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor={colors.textSecondary}
            value={nome}
            onChangeText={setNome}
          />
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
            placeholder="Senha (mínimo 6 caracteres)"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>
        <View style={styles.campo}>
          <Phone color={colors.textSecondary} size={18} />
          <TextInput
            style={styles.input}
            placeholder="Telefone (opcional)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />
        </View>

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
          onPress={cadastrar}
          disabled={carregando}
        >
          {carregando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Criar conta</Text>}
        </Pressable>

        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.offWhite },
  container: { flexGrow: 1, backgroundColor: colors.offWhite, padding: 24, paddingTop: 20 },
  voltar: { marginBottom: 8 },
  marca: { width: 84, height: 80, alignSelf: 'center', marginBottom: 4 },
  titulo: { fontSize: 20, fontWeight: '600', color: colors.darkGreen, textAlign: 'center' },
  subtitulo: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 28 },
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
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: colors.text },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 12 },
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
  botaoPressionado: { opacity: 0.85 },
  botaoTexto: { color: colors.white, fontSize: 15, fontWeight: '600' },
  link: { color: colors.green, fontSize: 13, textAlign: 'center', marginTop: 18 },
});
