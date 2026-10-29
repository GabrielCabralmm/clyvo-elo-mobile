import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { CampoTexto } from '@/components/CampoTexto';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Seletor } from '@/components/Seletor';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { validarLogin } from '@/domain/autenticacao';
import { extrairMensagemDeErro } from '@/domain/erros';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';
import { Papel } from '@/types';

const PAPEIS: { valor: Papel; rotulo: string }[] = [
  { valor: 'Tutor', rotulo: 'Tutor' },
  { valor: 'Doutor', rotulo: 'Doutor' },
];

export default function Login() {
  const { entrar } = useAuth();
  const estilos = useEstilos(criarEstilos);
  const [papel, setPapel] = useState<Papel>('Tutor');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function fazerLogin() {
    const problema = validarLogin(email, senha);
    if (problema) {
      setErro(problema);
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await entrar(papel, email, senha);
      router.replace('/');
    } catch (erroDaRequisicao) {
      setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível entrar agora.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela rolavel estiloConteudo={estilos.conteudo}>
        <Image source={require('../../../assets/images/clyvo-logo.png')} style={estilos.logo} resizeMode="contain" />
        <Text style={estilos.subtitulo}>Continuidade de cuidado, do consultório para casa</Text>

        <Seletor opcoes={PAPEIS} valor={papel} aoMudar={setPapel} />

        <CampoTexto
          icone={Mail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <CampoTexto
          icone={Lock}
          placeholder="Senha"
          secureTextEntry
          autoComplete="password"
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={fazerLogin}
        />

        <MensagemDeErro texto={erro} />

        <Botao titulo="Entrar" aoPressionar={fazerLogin} carregando={carregando} />

        <Pressable onPress={() => router.push('/(auth)/cadastro')} hitSlop={8}>
          <Text style={estilos.link}>Não tem conta? Cadastre-se como tutor</Text>
        </Pressable>
      </Tela>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (cores: Paleta) => ({
  flex: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, justifyContent: 'center' as const, maxWidth: 440 },
  logo: { width: 220, height: 90, alignSelf: 'center' as const, marginBottom: 8 },
  subtitulo: { fontSize: 13, color: cores.textoSecundario, textAlign: 'center' as const, marginBottom: 28 },
  link: { color: cores.primaria, fontSize: 13, textAlign: 'center' as const, marginTop: 18, fontWeight: '500' as const },
});
