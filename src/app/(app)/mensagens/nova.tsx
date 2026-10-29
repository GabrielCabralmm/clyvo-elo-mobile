import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Seletor } from '@/components/Seletor';
import { Tela } from '@/components/Tela';
import { useTema } from '@/contexts/TemaContext';
import { extrairMensagemDeErro } from '@/domain/erros';
import { CATEGORIAS_MENSAGEM, TAMANHO_MAXIMO_CONTEUDO, validarNovaMensagem } from '@/domain/mensagens';
import { useEnviarMensagem } from '@/hooks/useMensagens';
import { usePet } from '@/hooks/usePets';
import { CategoriaMensagem } from '@/types';

export default function NovaMensagem() {
  const { idPet } = useLocalSearchParams<{ idPet: string }>();
  const idDoPet = Number(idPet);
  const { cores } = useTema();
  const { data: pet } = usePet(idDoPet);
  const enviar = useEnviarMensagem();
  const [categoria, setCategoria] = useState<CategoriaMensagem>('ORIENTACAO');
  const [assunto, setAssunto] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [erro, setErro] = useState('');

  function enviarMensagem() {
    const validacao = validarNovaMensagem(idDoPet, categoria, assunto, conteudo);
    if (!validacao.ok) {
      setErro(validacao.erro);
      return;
    }
    setErro('');
    enviar.mutate(validacao.valor, {
      onSuccess: (mensagem) => router.replace(`/mensagens/${mensagem.id}`),
      onError: (erroDaRequisicao) => setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível enviar agora.')),
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: cores.fundo }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela rolavel>
        <Cabecalho
          titulo="Orientação ao tutor"
          subtitulo={pet ? `${pet.nome}${pet.nomeTutor ? ` · ${pet.nomeTutor} recebe uma notificação` : ''}` : undefined}
          voltar="fechar"
        />

        <Seletor rotulo="Categoria" opcoes={CATEGORIAS_MENSAGEM} valor={categoria} aoMudar={setCategoria} emGrade />
        <CampoTexto rotulo="Assunto" placeholder="Ex.: Cuidados com os pontos" value={assunto} onChangeText={setAssunto} maxLength={120} />
        <CampoTexto
          rotulo={`Orientação (${conteudo.length}/${TAMANHO_MAXIMO_CONTEUDO})`}
          placeholder="Ex.: manter o colar elizabetano por 10 dias e limpar o local com soro duas vezes ao dia."
          value={conteudo}
          onChangeText={setConteudo}
          multiline
          maxLength={TAMANHO_MAXIMO_CONTEUDO}
        />

        <MensagemDeErro texto={erro} />
        <Botao titulo="Enviar ao tutor" icone={Send} aoPressionar={enviarMensagem} carregando={enviar.isPending} />
      </Tela>
    </KeyboardAvoidingView>
  );
}
