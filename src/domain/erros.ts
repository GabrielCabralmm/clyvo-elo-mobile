interface RespostaDeErro {
  detail?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export function extrairMensagemDeErro(erro: unknown, mensagemPadrao: string): string {
  const resposta = (erro as { response?: { status?: number; data?: RespostaDeErro } })?.response;

  if (!resposta) {
    return 'Sem conexão com o servidor. Se for o primeiro acesso do dia, aguarde uns 30 segundos e tente de novo.';
  }

  const corpo = resposta.data;
  const primeiroErroDeValidacao = corpo?.errors ? Object.values(corpo.errors).flat()[0] : undefined;

  return primeiroErroDeValidacao ?? corpo?.detail ?? mensagemPadrao;
}

export function statusDoErro(erro: unknown): number | undefined {
  return (erro as { response?: { status?: number } })?.response?.status;
}
