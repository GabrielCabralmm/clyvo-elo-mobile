import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Cake, Calendar, Check, MessageCirclePlus, MessagesSquare, Scale, Tag, Trash2, User } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Carregando } from '@/components/Carregando';
import { confirmar } from '@/components/confirmar';
import { IconeDoPet } from '@/components/IconeDoPet';
import { LinhaDeInformacao } from '@/components/LinhaDeInformacao';
import { MensagemDeErro } from '@/components/MensagemDeErro';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { useTema } from '@/contexts/TemaContext';
import { formatarData } from '@/domain/datas';
import { extrairMensagemDeErro } from '@/domain/erros';
import { formatarPeso, idadeDoPet, interpretarPeso, rotuloDaEspecie } from '@/domain/pets';
import { useEstilos } from '@/hooks/useEstilos';
import { useAtualizarPeso, useExcluirPet, usePet } from '@/hooks/usePets';
import { Paleta } from '@/theme/paletas';

export default function DetalhePet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idPet = Number(id);
  const { ehDoutor } = useAuth();
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);
  const { data: pet, isLoading, isError, error } = usePet(idPet);
  const atualizarPeso = useAtualizarPeso(idPet);
  const excluirPet = useExcluirPet(idPet);
  const [novoPeso, setNovoPeso] = useState('');
  const [editandoPeso, setEditandoPeso] = useState(false);
  const [erro, setErro] = useState('');

  if (isLoading) {
    return <Carregando telaCheia />;
  }

  if (isError || !pet) {
    return (
      <Tela>
        <Cabecalho titulo="Pet" voltar="seta" />
        <MensagemDeErro texto={extrairMensagemDeErro(error, 'Pet não encontrado.')} />
      </Tela>
    );
  }

  function salvarPeso() {
    const validacao = interpretarPeso(novoPeso);
    if (!validacao.ok) {
      setErro(validacao.erro);
      return;
    }
    atualizarPeso.mutate(validacao.valor, {
      onSuccess: () => {
        setEditandoPeso(false);
        setErro('');
      },
      onError: (erroDaRequisicao) => setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível atualizar o peso.')),
    });
  }

  function pedirExclusao() {
    confirmar('Excluir pet', `Tem certeza que quer excluir ${pet!.nome}?`, 'Excluir', () =>
      excluirPet.mutate(undefined, {
        onSuccess: () => router.back(),
        onError: (erroDaRequisicao) => setErro(extrairMensagemDeErro(erroDaRequisicao, 'Não foi possível excluir agora.')),
      })
    );
  }

  return (
    <Tela rolavel>
      <Cabecalho titulo="" voltar="seta" />

      <View style={estilos.topo}>
        <IconeDoPet especie={pet.especie} tamanho={84} />
        <Text style={estilos.nome}>{pet.nome}</Text>
        <Text style={estilos.especie}>{pet.raca ?? rotuloDaEspecie(pet.especie)}</Text>
      </View>

      <LinhaDeInformacao icone={Tag} rotulo="Espécie" valor={rotuloDaEspecie(pet.especie)} />
      {pet.dataNascimento ? (
        <LinhaDeInformacao icone={Cake} rotulo="Idade" valor={`${idadeDoPet(pet.dataNascimento)} · nasceu em ${formatarData(pet.dataNascimento)}`} />
      ) : null}
      {ehDoutor && pet.nomeTutor ? <LinhaDeInformacao icone={User} rotulo="Tutor" valor={pet.nomeTutor} /> : null}

      <LinhaDeInformacao
        icone={Scale}
        rotulo={ehDoutor ? 'Peso' : 'Peso (toque para atualizar)'}
        aoPressionar={
          !ehDoutor && !editandoPeso
            ? () => {
                setNovoPeso(pet.pesoKg ? String(pet.pesoKg).replace('.', ',') : '');
                setEditandoPeso(true);
              }
            : undefined
        }
      >
        {editandoPeso ? (
          <View style={estilos.edicaoPeso}>
            <TextInput
              style={estilos.entradaPeso}
              keyboardType="decimal-pad"
              value={novoPeso}
              onChangeText={setNovoPeso}
              placeholder="kg"
              placeholderTextColor={cores.textoSecundario}
              autoFocus
              onSubmitEditing={salvarPeso}
            />
            <Pressable onPress={salvarPeso} hitSlop={8} accessibilityLabel="Salvar peso">
              <Check color={cores.primaria} size={22} />
            </Pressable>
          </View>
        ) : (
          <Text style={estilos.valor}>{formatarPeso(pet.pesoKg) ?? (ehDoutor ? 'Não informado' : 'Adicionar')}</Text>
        )}
      </LinhaDeInformacao>

      <MensagemDeErro texto={erro} />

      <Botao titulo="Eventos clínicos" icone={Calendar} aoPressionar={() => router.push(`/eventos/${idPet}`)} />
      <Botao
        titulo={ehDoutor ? 'Enviar orientação ao tutor' : 'Orientações da clínica'}
        icone={ehDoutor ? MessageCirclePlus : MessagesSquare}
        variante="secundario"
        aoPressionar={() => router.push(ehDoutor ? `/mensagens/nova?idPet=${idPet}` : `/mensagens?idPet=${idPet}`)}
      />
      {!ehDoutor && (
        <Botao titulo="Excluir pet" icone={Trash2} variante="perigo" aoPressionar={pedirExclusao} carregando={excluirPet.isPending} />
      )}
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  topo: { alignItems: 'center' as const, marginBottom: 24, marginTop: -8 },
  nome: { fontSize: 24, fontWeight: '700' as const, color: cores.texto, marginTop: 12 },
  especie: { fontSize: 14, color: cores.textoSecundario, marginTop: 2 },
  valor: { fontSize: 15, fontWeight: '600' as const, color: cores.texto, marginTop: 2 },
  edicaoPeso: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginTop: 4 },
  entradaPeso: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: cores.texto,
  },
});
