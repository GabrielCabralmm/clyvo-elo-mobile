import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { PawPrint, Scale, Tag } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Seletor } from '@/components/Seletor';
import { Tela } from '@/components/Tela';
import { useTema } from '@/contexts/TemaContext';
import { extrairMensagemDeErro } from '@/domain/erros';
import { ESPECIES, validarNovoPet } from '@/domain/pets';
import { useCriarPet } from '@/hooks/usePets';
import { Especie } from '@/types';

export default function NovoPet() {
  const { cores } = useTema();
  const criarPet = useCriarPet();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<Especie>('CACHORRO');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [erro, setErro] = useState('');

  function salvar() {
    const validacao = validarNovoPet(nome, especie, raca, peso);
    if (!validacao.ok) {
      setErro(validacao.erro);
      return;
    }
    setErro('');
    criarPet.mutate(validacao.valor, {
      onSuccess: (pet) => router.replace(`/pet/${pet.idPet}`),
      onError: (erroDaRequisicao) => setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível cadastrar o pet agora.')),
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: cores.fundo }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Tela rolavel>
        <Cabecalho titulo="Novo pet" subtitulo="Os dados aparecem para a equipe da clínica" voltar="fechar" />

        <CampoTexto icone={PawPrint} rotulo="Nome" placeholder="Ex.: Toby" value={nome} onChangeText={setNome} maxLength={100} />
        <Seletor rotulo="Espécie" opcoes={ESPECIES} valor={especie} aoMudar={setEspecie} />
        <CampoTexto icone={Tag} rotulo="Raça" placeholder="Opcional" value={raca} onChangeText={setRaca} maxLength={100} />
        <CampoTexto icone={Scale} rotulo="Peso (kg)" placeholder="Opcional, ex.: 12,5" keyboardType="decimal-pad" value={peso} onChangeText={setPeso} />

        <MensagemDeErro texto={erro} />
        <Botao titulo="Salvar" aoPressionar={salvar} carregando={criarPet.isPending} />
      </Tela>
    </KeyboardAvoidingView>
  );
}
