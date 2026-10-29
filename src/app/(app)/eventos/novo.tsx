import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { CampoTexto } from '@/components/CampoTexto';
import { ICONE_DO_EVENTO } from '@/components/IconeDoEvento';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Seletor } from '@/components/Seletor';
import { Tela } from '@/components/Tela';
import { formatarData } from '@/domain/datas';
import { extrairMensagemDeErro } from '@/domain/erros';
import { dataDaqui, OPCOES_DE_DATA, TIPOS_EVENTO } from '@/domain/eventos';
import { useCriarEvento } from '@/hooks/useEventos';
import { usePet } from '@/hooks/usePets';
import { TipoEvento } from '@/types';

const OPCOES_DE_TIPO = TIPOS_EVENTO.map((tipo) => ({ ...tipo, icone: ICONE_DO_EVENTO[tipo.valor] }));
const OPCOES_DE_QUANDO = OPCOES_DE_DATA.map((opcao) => ({ valor: opcao.dias, rotulo: opcao.rotulo }));

export default function NovoEvento() {
  const { idPet } = useLocalSearchParams<{ idPet: string }>();
  const idDoPet = Number(idPet);
  const { data: pet } = usePet(idDoPet);
  const criarEvento = useCriarEvento(idDoPet);
  const [tipoEvento, setTipoEvento] = useState<TipoEvento>('CHECKUP');
  const [diasAteOEvento, setDiasAteOEvento] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const dataEvento = dataDaqui(diasAteOEvento);

  function registrar() {
    setErro('');
    criarEvento.mutate(
      { idPet: idDoPet, tipoEvento, descricao: descricao.trim() || undefined, dataEvento },
      {
        onSuccess: () => router.back(),
        onError: (erroDaRequisicao) => setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível registrar o evento agora.')),
      }
    );
  }

  return (
    <Tela rolavel>
      <Cabecalho
        titulo="Novo evento clínico"
        subtitulo={pet ? `Para ${pet.nome}${pet.nomeTutor ? `, de ${pet.nomeTutor}` : ''}` : undefined}
        voltar="fechar"
      />

      <Seletor rotulo="Tipo" opcoes={OPCOES_DE_TIPO} valor={tipoEvento} aoMudar={setTipoEvento} emGrade />
      <Seletor rotulo={`Quando · ${formatarData(dataEvento)}`} opcoes={OPCOES_DE_QUANDO} valor={diasAteOEvento} aoMudar={setDiasAteOEvento} emGrade />
      <CampoTexto
        rotulo="Descrição"
        placeholder="Ex.: retorno para retirar os pontos"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        maxLength={500}
      />

      <MensagemDeErro texto={erro} />
      <Botao titulo="Registrar" aoPressionar={registrar} carregando={criarEvento.isPending} />
    </Tela>
  );
}
