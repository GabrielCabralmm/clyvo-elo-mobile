import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { avisosDeEventosNovos, avisosDeMensagens, lembretesDeEventos } from '@/domain/avisos';
import { eventosParaLembrar } from '@/domain/eventos';
import { mensagensNovas } from '@/domain/mensagens';
import { avisarAgora, pedirPermissao, substituirLembretes } from '@/lib/notificacoes';
import { gravarRegistro, lerRegistro, RegistroDeAvisos } from '@/lib/registroDeAvisos';
import { listarEventosDoPet } from '@/services/eventoService';
import { listarMeusPets } from '@/services/petService';
import { chaves } from './chavesDeConsulta';
import { INTERVALO_DE_ATUALIZACAO_MS, useMensagensNaoLidas } from './useMensagens';

export function useCentralDeAvisos() {
  const { id, papel } = useAuth();
  const ativo = papel === 'Tutor' && id !== null;
  const registro = useRef<RegistroDeAvisos>({});
  const [registroPronto, setRegistroPronto] = useState(false);

  useEffect(() => {
    if (!ativo || id === null) {
      return;
    }
    pedirPermissao();
    setRegistroPronto(false);
    lerRegistro(id).then((salvo) => {
      registro.current = salvo;
      setRegistroPronto(true);
    });
  }, [ativo, id]);

  const { data: naoLidas } = useMensagensNaoLidas(ativo);

  const { data: pets } = useQuery({
    queryKey: [...chaves.todosOsPets, 'avisos'],
    queryFn: () => listarMeusPets({ pagina: 1, tamanhoPagina: 50 }),
    enabled: ativo,
    refetchInterval: INTERVALO_DE_ATUALIZACAO_MS * 2,
    select: (pagina) => pagina.itens,
  });

  const consultasDeEventos = useQueries({
    queries: (pets ?? []).map((pet) => ({
      queryKey: [...chaves.eventosDoPet(pet.idPet), 'avisos'],
      queryFn: () => listarEventosDoPet(pet.idPet, 1, 50),
      refetchInterval: INTERVALO_DE_ATUALIZACAO_MS * 2,
      enabled: ativo,
    })),
  });

  const eventosCarregados = consultasDeEventos.length > 0 && consultasDeEventos.every((c) => c.isSuccess);
  const eventos = useMemo(
    () => consultasDeEventos.flatMap((consulta) => consulta.data?.itens ?? []),
    [consultasDeEventos]
  );
  const assinaturaDosEventos = eventos.map((e) => `${e.idEvento}:${e.status}:${e.dataEvento}`).join('|');

  const nomeDoPet = useMemo(() => {
    const nomes = new Map((pets ?? []).map((pet) => [pet.idPet, pet.nome]));
    return (idPet: number) => nomes.get(idPet) ?? 'seu pet';
  }, [pets]);

  useEffect(() => {
    if (!ativo || id === null || !naoLidas || !registroPronto) {
      return;
    }
    const jaConhecidas = registro.current.mensagens;
    const novas = jaConhecidas ? mensagensNovas(naoLidas, new Set(jaConhecidas)) : [];
    if (novas.length > 0) {
      avisosDeMensagens(novas).forEach(avisarAgora);
    }

    registro.current = {
      ...registro.current,
      mensagens: Array.from(new Set([...(jaConhecidas ?? []), ...naoLidas.map((m) => m.id)])),
    };
    gravarRegistro(id, registro.current);
  }, [ativo, id, naoLidas, registroPronto]);

  useEffect(() => {
    if (!ativo || id === null || !eventosCarregados || !registroPronto) {
      return;
    }
    const pendentes = eventosParaLembrar(eventos);
    const jaConhecidos = registro.current.eventos;
    const conhecidos = new Set(jaConhecidos ?? []);
    const novos = jaConhecidos ? pendentes.filter((evento) => !conhecidos.has(evento.idEvento)) : [];
    if (novos.length > 0) {
      avisosDeEventosNovos(novos, nomeDoPet).forEach(avisarAgora);
    }

    substituirLembretes(lembretesDeEventos(pendentes, nomeDoPet));

    registro.current = {
      ...registro.current,
      eventos: Array.from(new Set([...conhecidos, ...eventos.map((e) => e.idEvento)])),
    };
    gravarRegistro(id, registro.current);
  }, [ativo, id, eventosCarregados, assinaturaDosEventos, registroPronto]);

  return { naoLidas: naoLidas?.length ?? 0 };
}
