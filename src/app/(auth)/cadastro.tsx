import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Lock, Mail, Phone, User } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { validarCadastro } from '@/domain/autenticacao';
import { extrairMensagemDeErro } from '@/domain/erros';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

export default function Cadastro() {
  const { cadastrarComoTutor } = useAuth();
  const estilos = useEstilos(criarEstilos);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function cadastrar() {
    const validacao = validarCadastro(nome, email, senha, telefone);
    if (!validacao.ok) {
      setErro(validacao.erro);
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await cadastrarComoTutor(validacao.valor);
      router.replace('/');
    } catch (erroDaRequisicao) {
      setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível criar a conta agora.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela rolavel estiloConteudo={estilos.conteudo}>
        <Cabecalho titulo="Criar conta de tutor" subtitulo="Leva menos de um minuto" voltar="seta" />
        <Image source={require('../../../assets/images/clyvo-mark.png')} style={estilos.marca} resizeMode="contain" />

        <CampoTexto icone={User} placeholder="Nome completo" value={nome} onChangeText={setNome} />
        <CampoTexto
          icone={Mail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <CampoTexto icone={Lock} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry value={senha} onChangeText={setSenha} />
        <CampoTexto icone={Phone} placeholder="Telefone (opcional)" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />

        <MensagemDeErro texto={erro} />

        <Botao titulo="Criar conta" aoPressionar={cadastrar} carregando={carregando} />

        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={estilos.link}>Já tem conta? Entrar</Text>
        </Pressable>
      </Tela>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (cores: Paleta) => ({
  flex: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { maxWidth: 440 },
  marca: { width: 72, height: 68, alignSelf: 'center' as const, marginBottom: 20 },
  link: { color: cores.primaria, fontSize: 13, textAlign: 'center' as const, marginTop: 18, fontWeight: '500' as const },
});
