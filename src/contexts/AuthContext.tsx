import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { lerSessaoSalva, limparSessaoSalva, salvarSessao, SessaoSalva } from '@/lib/sessao';
import { cadastrarTutor, entrar as entrarNaApi } from '@/services/authService';
import { definirToken } from '@/services/http';
import { CadastroTutorRequest, LoginResponse, Papel } from '@/types';

interface AuthState {
  token: string | null;
  papel: Papel | null;
  nome: string | null;
  id: number | null;
  carregando: boolean;
  ehDoutor: boolean;
  entrar: (papel: Papel, email: string, senha: string) => Promise<void>;
  cadastrarComoTutor: (dados: CadastroTutorRequest) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [sessao, setSessao] = useState<SessaoSalva | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    lerSessaoSalva().then((salva) => {
      definirToken(salva?.token ?? null);
      setSessao(salva);
      setCarregando(false);
    });
  }, []);

  const iniciarSessao = useCallback(async (resposta: LoginResponse) => {
    const nova: SessaoSalva = { token: resposta.token, papel: resposta.papel, nome: resposta.nome, id: resposta.id };
    definirToken(nova.token);
    await salvarSessao(nova);
    queryClient.clear();
    setSessao(nova);
  }, [queryClient]);

  const valor = useMemo<AuthState>(
    () => ({
      token: sessao?.token ?? null,
      papel: sessao?.papel ?? null,
      nome: sessao?.nome ?? null,
      id: sessao?.id ?? null,
      carregando,
      ehDoutor: sessao?.papel === 'Doutor',
      entrar: async (papel, email, senha) => iniciarSessao(await entrarNaApi(papel, email, senha)),
      cadastrarComoTutor: async (dados) => iniciarSessao(await cadastrarTutor(dados)),
      sair: async () => {
        definirToken(null);
        await limparSessaoSalva();
        queryClient.clear();
        setSessao(null);
      },
    }),
    [sessao, carregando, iniciarSessao, queryClient]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider');
  }
  return contexto;
}
