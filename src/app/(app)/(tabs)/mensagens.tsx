import { FlatList, RefreshControl, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { Etiqueta } from '@/components/Etiqueta';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { useTema } from '@/contexts/TemaContext';
import { descreverQuando } from '@/domain/datas';
import { extrairMensagemDeErro } from '@/domain/erros';
import { rotuloDaCategoria } from '@/domain/mensagens';
import { useEstilos } from '@/hooks/useEstilos';
import { useMensagens } from '@/hooks/useMensagens';
import { Paleta } from '@/theme/paletas';

export default function Mensagens() {
  const { idPet } = useLocalSearchParams<{ idPet?: string }>();
  const { ehDoutor } = useAuth();
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);
  const { mensagens, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMensagens(idPet ? Number(idPet) : undefined);

  return (
    <Tela>
      <Cabecalho
        titulo={ehDoutor ? 'Mensagens enviadas' : 'Orientações da clínica'}
        subtitulo={ehDoutor ? 'O que você enviou aos tutores' : 'Mensagens da equipe veterinária sobre seus pets'}
      />

      {isLoading && <Carregando />}
      <MensagemDeErro texto={isError ? extrairMensagemDeErro(error, 'Não foi possível carregar as mensagens.') : null} />

      <FlatList
        data={mensagens}
        keyExtractor={(mensagem) => mensagem.id}
        contentContainerStyle={estilos.lista}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={cores.primaria} />}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        ListFooterComponent={isFetchingNextPage ? <Carregando /> : null}
        ListEmptyComponent={
          !isLoading ? (
            <EstadoVazio
              icone={MessageCircle}
              titulo={ehDoutor ? 'Nenhuma mensagem enviada' : 'Nenhuma orientação ainda'}
              texto={ehDoutor ? 'Abra um paciente e toque em "Enviar orientação ao tutor".' : 'Quando o veterinário enviar uma orientação, ela aparece aqui e você recebe uma notificação.'}
            />
          ) : null
        }
        renderItem={({ item }) => {
          const destaque = !ehDoutor && !item.lida;
          return (
            <Cartao aoPressionar={() => router.push(`/mensagens/${item.id}`)} estilo={destaque ? estilos.naoLida : undefined}>
              <View style={estilos.topo}>
                <Etiqueta texto={rotuloDaCategoria(item.categoria)} />
                <Text style={estilos.quando}>{descreverQuando(item.dataEnvio)}</Text>
              </View>
              <Text style={[estilos.assunto, destaque && estilos.assuntoNaoLido]}>{item.assunto}</Text>
              <Text style={estilos.trecho} numberOfLines={2}>{item.conteudo}</Text>
              <Text style={estilos.rodape}>
                {item.nomePet} · {ehDoutor ? (item.lida ? 'Lida pelo tutor' : 'Ainda não lida') : item.nomeDoutor}
              </Text>
            </Cartao>
          );
        }}
      />
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  lista: { paddingBottom: 32, flexGrow: 1 },
  naoLida: { borderColor: cores.primaria, borderLeftWidth: 4 },
  topo: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 8 },
  quando: { fontSize: 12, color: cores.textoSecundario },
  assunto: { fontSize: 15, fontWeight: '600' as const, color: cores.texto },
  assuntoNaoLido: { color: cores.titulo },
  trecho: { fontSize: 13, color: cores.textoSecundario, marginTop: 4 },
  rodape: { fontSize: 12, color: cores.primaria, marginTop: 8, fontWeight: '500' as const },
});
