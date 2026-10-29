import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/lib/storage';
import { Paleta, paletaClara, paletaEscura } from '@/theme/paletas';

export type PreferenciaTema = 'sistema' | 'claro' | 'escuro';

interface TemaState {
  cores: Paleta;
  escuro: boolean;
  preferencia: PreferenciaTema;
  definirPreferencia: (preferencia: PreferenciaTema) => Promise<void>;
}

const CHAVE_PREFERENCIA = 'preferenciaTema';

const TemaContext = createContext<TemaState | undefined>(undefined);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const esquemaDoSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('sistema');

  useEffect(() => {
    storage.getItem(CHAVE_PREFERENCIA).then((salva) => {
      if (salva === 'claro' || salva === 'escuro' || salva === 'sistema') {
        setPreferencia(salva);
      }
    });
  }, []);

  const escuro = preferencia === 'sistema' ? esquemaDoSistema === 'dark' : preferencia === 'escuro';

  const valor = useMemo<TemaState>(
    () => ({
      cores: escuro ? paletaEscura : paletaClara,
      escuro,
      preferencia,
      definirPreferencia: async (nova) => {
        setPreferencia(nova);
        await storage.setItem(CHAVE_PREFERENCIA, nova);
      },
    }),
    [escuro, preferencia]
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema precisa estar dentro de um TemaProvider');
  }
  return contexto;
}
