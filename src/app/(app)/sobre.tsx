import { Linking, Text, View } from 'react-native';
import { GitBranch, GitCommitHorizontal, Code, Package, Server, Users } from 'lucide-react-native';
import { Cabecalho } from '@/components/Cabecalho';
import { Cartao } from '@/components/Cartao';
import { LinhaDeInformacao } from '@/components/LinhaDeInformacao';
import { Tela } from '@/components/Tela';
import { useTema } from '@/contexts/TemaContext';
import { sobreOApp } from '@/config/sobreOApp';
import { formatarDataHora } from '@/domain/datas';
import { useEstilos } from '@/hooks/useEstilos';
import { Paleta } from '@/theme/paletas';

export default function Sobre() {
  const { cores } = useTema();
  const estilos = useEstilos(criarEstilos);

  return (
    <Tela rolavel>
      <Cabecalho titulo="Sobre o App" subtitulo="Identificação desta versão do CLYVO Elo" voltar="seta" />

      <Cartao estilo={estilos.destaque}>
        <Text style={estilos.rotuloHash}>Commit desta versão</Text>
        <Text style={estilos.hash} selectable>{sobreOApp.commitHash}</Text>
        {sobreOApp.commitData ? <Text style={estilos.data}>{formatarDataHora(sobreOApp.commitData)}</Text> : null}
      </Cartao>

      <LinhaDeInformacao icone={Package} rotulo="Versão" valor={`${sobreOApp.nome} ${sobreOApp.versao}`} />
      <LinhaDeInformacao icone={GitBranch} rotulo="Canal de build" valor={sobreOApp.canal} />
      <LinhaDeInformacao icone={Server} rotulo="API consumida" valor={sobreOApp.apiUrl} />
      <LinhaDeInformacao
        icone={Code}
        rotulo="Código-fonte"
        valor={sobreOApp.repositorio.replace('https://', '')}
        aoPressionar={() => Linking.openURL(`${sobreOApp.repositorio}/commit/${sobreOApp.commitHash}`)}
      />

      <Cartao>
        <View style={estilos.tituloEquipe}>
          <Users color={cores.primaria} size={16} />
          <Text style={estilos.equipe}>Equipe</Text>
        </View>
        {sobreOApp.integrantes.map((integrante) => (
          <View key={integrante.rm} style={estilos.integrante}>
            <Text style={estilos.nome}>{integrante.nome}</Text>
            <Text style={estilos.rm}>{integrante.rm} · {integrante.turma}</Text>
          </View>
        ))}
      </Cartao>

      <View style={estilos.rodape}>
        <GitCommitHorizontal color={cores.textoSecundario} size={14} />
        <Text style={estilos.rodapeTexto}>Challenge FIAP 2026 · CLYVO VET</Text>
      </View>
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  destaque: { alignItems: 'center' as const, paddingVertical: 22, backgroundColor: cores.superficieSuave, borderColor: cores.superficieSuave },
  rotuloHash: { fontSize: 12, color: cores.textoSecundario, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  hash: { fontSize: 30, fontWeight: '700' as const, color: cores.titulo, fontFamily: 'monospace', marginTop: 6, letterSpacing: 2 },
  data: { fontSize: 12, color: cores.textoSecundario, marginTop: 4 },
  tituloEquipe: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 10 },
  equipe: { fontSize: 15, fontWeight: '600' as const, color: cores.texto },
  integrante: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: cores.borda },
  nome: { fontSize: 14, fontWeight: '600' as const, color: cores.texto },
  rm: { fontSize: 12, color: cores.textoSecundario, marginTop: 2 },
  rodape: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 6, marginTop: 8 },
  rodapeTexto: { fontSize: 12, color: cores.textoSecundario },
});
