import { Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bell, BellOff, Info, LogOut, ShieldCheck } from 'lucide-react-native';
import { Botao } from '@/components/Botao';
import { Cartao } from '@/components/Cartao';
import { LinhaDeInformacao } from '@/components/LinhaDeInformacao';
import { Seletor } from '@/components/Seletor';
import { Tela } from '@/components/Tela';
import { useAuth } from '@/contexts/AuthContext';
import { PreferenciaTema, useTema } from '@/contexts/TemaContext';
import { useEstilos } from '@/hooks/useEstilos';
import { usePermissaoDeNotificacao } from '@/hooks/usePermissaoDeNotificacao';
import { Paleta } from '@/theme/paletas';

const OPCOES_DE_TEMA: { valor: PreferenciaTema; rotulo: string }[] = [
  { valor: 'sistema', rotulo: 'Sistema' },
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
];

export default function Perfil() {
  const { nome, papel, ehDoutor, sair } = useAuth();
  const { cores, preferencia, definirPreferencia } = useTema();
  const estilos = useEstilos(criarEstilos);
  const notificacoes = usePermissaoDeNotificacao();

  async function fazerLogout() {
    await sair();
    router.replace('/(auth)/login');
  }

  return (
    <Tela rolavel>
      <Image source={require('../../../../assets/images/clyvo-mark.png')} style={estilos.marca} resizeMode="contain" />

      <Cartao estilo={estilos.cartaoUsuario}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{nome?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={estilos.nome}>{nome}</Text>
        <View style={estilos.papel}>
          <ShieldCheck color={cores.primaria} size={14} />
          <Text style={estilos.papelTexto}>{papel}</Text>
        </View>
      </Cartao>

      <Text style={estilos.secao}>Aparência</Text>
      <Seletor opcoes={OPCOES_DE_TEMA} valor={preferencia} aoMudar={definirPreferencia} />

      {!ehDoutor && (
        <>
          <Text style={estilos.secao}>Notificações</Text>
          <LinhaDeInformacao
            icone={notificacoes.ativa ? Bell : BellOff}
            rotulo={notificacoes.ativa ? 'Ativadas' : 'Desativadas'}
            valor={notificacoes.ativa ? 'Você recebe orientações e lembretes de cuidados' : 'Toque para receber orientações e lembretes'}
            aoPressionar={notificacoes.ativa ? undefined : notificacoes.ativar}
          />
        </>
      )}

      <Text style={estilos.secao}>Aplicativo</Text>
      <LinhaDeInformacao icone={Info} rotulo="Sobre o App" valor="Versão, commit e equipe" aoPressionar={() => router.push('/sobre')} />

      <Botao titulo="Sair da conta" icone={LogOut} variante="perigo" aoPressionar={fazerLogout} />
    </Tela>
  );
}

const criarEstilos = (cores: Paleta) => ({
  marca: { width: 56, height: 52, alignSelf: 'center' as const, marginBottom: 20 },
  cartaoUsuario: { alignItems: 'center' as const, paddingVertical: 24 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: cores.superficieSuave,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  avatarLetra: { fontSize: 26, fontWeight: '700' as const, color: cores.primaria },
  nome: { fontSize: 18, fontWeight: '700' as const, color: cores.texto },
  papel: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: cores.superficieSuave,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },
  papelTexto: { fontSize: 12, color: cores.titulo, fontWeight: '600' as const },
  secao: { fontSize: 13, fontWeight: '600' as const, color: cores.textoSecundario, marginTop: 12, marginBottom: 8, textTransform: 'uppercase' as const },
});
