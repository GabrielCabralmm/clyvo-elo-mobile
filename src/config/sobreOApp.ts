import Constants from 'expo-constants';
import { API_URL } from '@/services/http';

interface ExtraDoApp {
  commitHash?: string;
  commitData?: string;
  canal?: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraDoApp;

export const sobreOApp = {
  nome: Constants.expoConfig?.name ?? 'CLYVO Elo',
  versao: Constants.expoConfig?.version ?? '1.0.0',
  commitHash: extra.commitHash ?? 'desenvolvimento',
  commitData: extra.commitData,
  canal: extra.canal ?? 'local',
  apiUrl: API_URL,
  repositorio: 'https://github.com/GabrielCabralmm/clyvo-elo-mobile',
  integrantes: [
    { nome: 'Gabriel Cabral Mendes Mariano', rm: 'RM563230', turma: '2TDSPO' },
    { nome: 'João Victor Santana dos Santos', rm: 'RM566063', turma: '2TDSPX' },
  ],
};
