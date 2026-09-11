import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { loginTutor, loginDoutor } from '@/api/auth';
import { Papel } from '@/types';

interface AuthState {
  token: string | null;
  papel: Papel | null;
  nome: string | null;
  id: number | null;
  carregando: boolean;
  entrarComoTutor: (email: string, senha: string) => Promise<void>;
  entrarComoDoutor: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [papel, setPapel] = useState<Papel | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      const tokenSalvo = await storage.getItem('token');
      const papelSalvo = await storage.getItem('papel');
      const nomeSalvo = await storage.getItem('nome');
      const idSalvo = await storage.getItem('id');
      if (tokenSalvo && papelSalvo) {
        setToken(tokenSalvo);
        setPapel(papelSalvo as Papel);
        setNome(nomeSalvo);
        setId(idSalvo ? Number(idSalvo) : null);
      }
      setCarregando(false);
    }
    carregarSessao();
  }, []);

  async function salvarSessao(resultado: { token: string; papel: Papel; nome: string; id: number }) {
    await storage.setItem('token', resultado.token);
    await storage.setItem('papel', resultado.papel);
    await storage.setItem('nome', resultado.nome);
    await storage.setItem('id', String(resultado.id));
    setToken(resultado.token);
    setPapel(resultado.papel);
    setNome(resultado.nome);
    setId(resultado.id);
  }

  async function entrarComoTutor(email: string, senha: string) {
    const resultado = await loginTutor(email, senha);
    await salvarSessao(resultado);
  }

  async function entrarComoDoutor(email: string, senha: string) {
    const resultado = await loginDoutor(email, senha);
    await salvarSessao(resultado);
  }

  async function sair() {
    await storage.deleteItem('token');
    await storage.deleteItem('papel');
    await storage.deleteItem('nome');
    await storage.deleteItem('id');
    setToken(null);
    setPapel(null);
    setNome(null);
    setId(null);
  }

  return (
    <AuthContext.Provider value={{ token, papel, nome, id, carregando, entrarComoTutor, entrarComoDoutor, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider');
  }
  return context;
}
