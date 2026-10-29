import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ClipboardList, Trash2 } from 'lucide-react-native';
import { BotaoFlutuante } from '@/components/BotaoFlutuante';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { confirmar } from '@/components/confirmar';
import { EstadoVazio } from '@/components/EstadoVazio';
import { Etiqueta } from '@/components/Etiqueta';
import { iconeDoEvento } from '@/components/IconeDoEvento';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { useTema } from '@/contexts/TemaContext';
import { descreverQuando, formatarData } from '@/domain/datas';
import { extrairMensagemDeErro } from '@/domain/erros';
import { ROTULO_STATUS, rotuloDoTipo, situacaoDoEvento, TOM_DO_STATUS } from '@/domain/eventos';
import { useAlternarStatusEvento, useEventosDoPet, useExcluirEvento } from '@/hooks/useEventos';
import { useEstilos } from '@/hooks/useEstilos';
import { usePet } from '@/hooks/usePets';
import { Paleta } from '@/theme/paletas';
import { EventoClinico } from '@/types';

export default function EventosDoPet() {
  const { idPet } = useLocalSearchParams<{ idPet: string }>();
  const idDoPet = Number(idPet);
  const { ehDoutor } = useAuth();
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);
  const { data: pet } = usePet(idDoPet);
  const { eventos, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEventosDoPet(idDoPet);
  const alternarStatus = useAlternarStatusEvento(idDoPet);
  const excluirEvento = useExcluirEvento(idDoPet);

  function pedirExclusao(evento: EventoClinico) {
    confirmar('Excluir evento', `Excluir "${rotuloDoTipo(evento.tipoEvento)}" de ${formatarData(evento.dataEvento)}?`, 'Excluir', () =>
      excluirEvento.mutate(evento.idEvento)
    );
  }

  const erroDeAcao = alternarStatus.error ?? excluirEvento.error;

  return (
    <Tela>
      <Cabecalho
        titulo={pet ? `Eventos de ${pet.nome}` : 'Eventos clínicos'}
        subtitulo={ehDoutor ? 'Toque no status para marcar como concluído' : 'Agenda e histórico de cuidados'}
        voltar="seta"
      />

      {isLoading && <Carregando />}
      <MensagemDeErro texto={isError ? extrairMensagemDeErro(error, 'Não foi possível carregar os eventos.') : null} />
      <MensagemDeErro texto={erroDeAcao ? extrairMensagemDeErro(erroDeAcao, 'Não foi possível concluir a ação.') : null} />

      <FlatList
        data={eventos}
        keyExtractor={(evento) => String(evento.idEvento)}
        contentContainerStyle={estilos.lista}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={cores.primaria} />}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        ListFooterComponent={isFetchingNextPage ? <Carregando /> : null}
        ListEmptyComponent={
          !isLoading ? (
            <EstadoVazio
              icone={ClipboardList}
              titulo="Nenhum evento registrado"
              texto={ehDoutor ? 'Toque no + para registrar o primeiro cuidado.' : 'O histórico aparece aqui assim que a clínica registrar algo.'}
            />
          ) : null
        }
        renderItem={({ item }) => {
          const Icone = iconeDoEvento(item.tipoEvento);
          const situacao = situacaoDoEvento(item);
          return (
            <Cartao estilo={estilos.cartao}>
              <View style={estilos.icone}>
                <Icone color={cores.primaria} size={18} />
              </View>
              <View style={estilos.textos}>
                <Text style={estilos.tipo}>{rotuloDoTipo(item.tipoEvento)}</Text>
                {item.descricao ? <Text style={estilos.descricao}>{item.descricao}</Text> : null}
                <Text style={estilos.data}>
                  {formatarData(item.dataEvento)} · {descreverQuando(item.dataEvento)}
                  {item.nomeDoutor ? ` · ${item.nomeDoutor}` : ''}
                </Text>
              </View>
              <View style={estilos.acoes}>
                <Pressable
                  disabled={!ehDoutor || alternarStatus.isPending}
                  onPress={() => alternarStatus.mutate(item)}
                  accessibilityLabel={ehDoutor ? 'Alterar status' : undefined}
                >
                  <Etiqueta texto={ROTULO_STATUS[situacao]} tom={TOM_DO_STATUS[situacao]} />
                </Pressable>
                {ehDoutor && (
                  <Pressable onPress={() => pedirExclusao(item)} hitSlop={8} accessibilityLabel="Excluir evento">
                    <Trash2 color={cores.perigo} size={16} />
                  </Pressable>
                )}
              </View>
            </Cartao>
          );
        }}
      />

      {ehDoutor && <BotaoFlutuante rotulo="Registrar evento" aoPressionar={() => router.push(`/eventos/novo?idPet=${idDoPet}`)} />}
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  lista: { paddingBottom: 96, flexGrow: 1 },
  cartao: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 12 },
  icone: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: cores.superficieSuave,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  textos: { flex: 1 },
  tipo: { fontSize: 15, fontWeight: '600' as const, color: cores.texto },
  descricao: { fontSize: 13, color: cores.texto, marginTop: 2 },
  data: { fontSize: 12, color: cores.textoSecundario, marginTop: 4 },
  acoes: { alignItems: 'flex-end' as const, gap: 12 },
});
