import { useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, HeartHandshake, Search } from 'lucide-react-native';
import { BotaoFlutuante } from '@/components/BotaoFlutuante';
import { CampoTexto } from '@/components/CampoTexto';
import { Carregando } from '@/components/Carregando';
import { Cartao } from '@/components/Cartao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { IconeDoPet } from '@/components/IconeDoPet';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { useTema } from '@/contexts/TemaContext';
import { extrairMensagemDeErro } from '@/domain/erros';
import { formatarPeso, idadeDoPet, rotuloDaEspecie } from '@/domain/pets';
import { useEstilos } from '@/hooks/useEstilos';
import { usePets } from '@/hooks/usePets';
import { useValorAtrasado } from '@/hooks/useValorAtrasado';
import { Paleta } from '@/theme/paletas';
import { Pet } from '@/types';

export default function Inicio() {
  const { nome, ehDoutor } = useAuth();
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);
  const [busca, setBusca] = useState('');
  const buscaAplicada = useValorAtrasado(busca);
  const { pets, total, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePets(buscaAplicada);

  function descricaoDoPet(pet: Pet) {
    return [pet.raca ?? rotuloDaEspecie(pet.especie), idadeDoPet(pet.dataNascimento), formatarPeso(pet.pesoKg)]
      .filter(Boolean)
      .join(' · ');
  }

  return (
    <Tela>
      <View style={estilos.cabecalho}>
        <Text style={estilos.saudacao}>Olá,</Text>
        <Text style={estilos.nome}>{nome}</Text>
      </View>

      <CampoTexto icone={Search} placeholder={ehDoutor ? 'Buscar paciente pelo nome' : 'Buscar entre meus pets'} value={busca} onChangeText={setBusca} />

      <Text style={estilos.secao}>
        {ehDoutor ? 'Pacientes' : 'Meus pets'}
        {total > 0 ? <Text style={estilos.contador}>  {total}</Text> : null}
      </Text>

      {isLoading && <Carregando />}
      {isError && <MensagemDeErro texto={extrairMensagemDeErro(error, 'Não foi possível carregar os pets agora.')} />}

      <FlatList
        data={pets}
        keyExtractor={(pet) => String(pet.idPet)}
        contentContainerStyle={estilos.lista}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={cores.primaria} />}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={isFetchingNextPage ? <Carregando /> : null}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <EstadoVazio
              icone={HeartHandshake}
              titulo={buscaAplicada ? 'Nenhum pet encontrado' : ehDoutor ? 'Nenhum paciente ainda' : 'Nenhum pet por aqui'}
              texto={buscaAplicada ? 'Tente outro nome.' : ehDoutor ? 'Os pets cadastrados pelos tutores aparecem aqui.' : 'Toque no + para cadastrar o primeiro.'}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <Cartao aoPressionar={() => router.push(`/pet/${item.idPet}`)} estilo={estilos.cartao}>
            <IconeDoPet especie={item.especie} />
            <View style={estilos.textos}>
              <Text style={estilos.petNome}>{item.nome}</Text>
              <Text style={estilos.petDetalhe}>{descricaoDoPet(item)}</Text>
              {ehDoutor && item.nomeTutor ? <Text style={estilos.petTutor}>Tutor: {item.nomeTutor}</Text> : null}
            </View>
            <ChevronRight color={cores.destaque} size={18} />
          </Cartao>
        )}
      />

      {!ehDoutor && <BotaoFlutuante rotulo="Cadastrar pet" aoPressionar={() => router.push('/pet/novo')} />}
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  cabecalho: { marginBottom: 16 },
  saudacao: { fontSize: 13, color: cores.textoSecundario },
  nome: { fontSize: 22, fontWeight: '700' as const, color: cores.texto },
  secao: { fontSize: 15, fontWeight: '600' as const, color: cores.texto, marginBottom: 12, marginTop: 4 },
  contador: { color: cores.textoSecundario, fontWeight: '400' as const },
  lista: { paddingBottom: 96, flexGrow: 1 },
  cartao: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  textos: { flex: 1 },
  petNome: { fontSize: 15, fontWeight: '600' as const, color: cores.texto },
  petDetalhe: { fontSize: 13, color: cores.textoSecundario, marginTop: 2 },
  petTutor: { fontSize: 12, color: cores.primaria, marginTop: 2 },
});
