import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCheck, PawPrint, Stethoscope, Trash2 } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { confirmar } from '@/components/confirmar';
import { Etiqueta } from '@/components/Etiqueta';
import { LinhaDeInformacao } from '@/components/LinhaDeInformacao';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { formatarDataHora } from '@/domain/datas';
import { extrairMensagemDeErro } from '@/domain/erros';
import { rotuloDaCategoria } from '@/domain/mensagens';
import { useEstilos } from '@/hooks/useEstilos';
import { useExcluirMensagem, useMarcarComoLida, useMensagem } from '@/hooks/useMensagens';
import { Paleta } from '@/theme/paletas';

export default function DetalheMensagem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ehDoutor } = useAuth();
  const estilos = useEstilos(criarEstilos);
  const { data: mensagem, isLoading, isError, error } = useMensagem(id);
  const marcarComoLida = useMarcarComoLida();
  const excluirMensagem = useExcluirMensagem();

  useEffect(() => {
    if (mensagem && !ehDoutor && !mensagem.lida && !marcarComoLida.isPending) {
      marcarComoLida.mutate(mensagem.id);
    }
  }, [mensagem, ehDoutor]);

  if (isLoading) {
    return <Carregando telaCheia />;
  }

  if (isError || !mensagem) {
    return (
      <Tela>
        <Cabecalho titulo="Mensagem" voltar="seta" />
        <MensagemDeErro texto={extrairMensagemDeErro(error, 'Mensagem não encontrada.')} />
      </Tela>
    );
  }

  function pedirExclusao() {
    confirmar('Excluir mensagem', 'O tutor deixa de ver esta orientação.', 'Excluir', () =>
      excluirMensagem.mutate(mensagem!.id, { onSuccess: () => router.back() })
    );
  }

  return (
    <Tela rolavel>
      <Cabecalho titulo={mensagem.assunto} subtitulo={formatarDataHora(mensagem.dataEnvio)} voltar="seta" />

      <Cartao>
        <Etiqueta texto={rotuloDaCategoria(mensagem.categoria)} />
        <Text style={estilos.conteudo}>{mensagem.conteudo}</Text>
      </Cartao>

      <LinhaDeInformacao icone={PawPrint} rotulo="Pet" valor={mensagem.nomePet} aoPressionar={() => router.push(`/pet/${mensagem.idPet}`)} />
      <LinhaDeInformacao icone={Stethoscope} rotulo="Enviada por" valor={mensagem.nomeDoutor} />
      <LinhaDeInformacao
        icone={CheckCheck}
        rotulo="Leitura"
        valor={mensagem.lida && mensagem.dataLeitura ? `Lida em ${formatarDataHora(mensagem.dataLeitura)}` : 'Ainda não lida pelo tutor'}
      />

      <MensagemDeErro texto={excluirMensagem.error ? extrairMensagemDeErro(excluirMensagem.error, 'Não foi possível excluir.') : null} />

      <View style={estilos.acoes}>
        <Botao titulo="Ver eventos do pet" variante="secundario" aoPressionar={() => router.push(`/eventos/${mensagem.idPet}`)} />
        {ehDoutor && <Botao titulo="Excluir mensagem" icone={Trash2} variante="perigo" aoPressionar={pedirExclusao} carregando={excluirMensagem.isPending} />}
      </View>
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  conteudo: { fontSize: 15, lineHeight: 22, color: cores.texto, marginTop: 12 },
  acoes: { marginTop: 4 },
});
