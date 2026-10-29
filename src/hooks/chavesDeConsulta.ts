export const chaves = {
  pets: (papel: string | null, busca: string) => ['pets', papel, busca] as const,
  todosOsPets: ['pets'] as const,
  pet: (id: number) => ['pet', id] as const,
  eventosDoPet: (idPet: number) => ['eventos', idPet] as const,
  mensagens: (filtro: object) => ['mensagens', filtro] as const,
  todasAsMensagens: ['mensagens'] as const,
  mensagem: (id: string) => ['mensagem', id] as const,
  naoLidas: ['mensagens', 'nao-lidas'] as const,
};
