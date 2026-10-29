import { useCallback, useEffect, useState } from 'react';
import { pedirPermissao, permissaoConcedida } from '@/lib/notificacoes';

export function usePermissaoDeNotificacao() {
  const [ativa, setAtiva] = useState<boolean | null>(null);

  useEffect(() => {
    permissaoConcedida().then(setAtiva);
  }, []);

  const ativar = useCallback(async () => {
    setAtiva(await pedirPermissao());
  }, []);

  return { ativa, ativar };
}
