export function formatarData(dataIso: string) {
  return new Date(dataIso).toLocaleDateString('pt-BR');
}

export function formatarDataHora(dataIso: string) {
  const data = new Date(dataIso);
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

export function inicioDoDia(data: Date) {
  const copia = new Date(data);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

export function diasAte(dataIso: string, hoje = new Date()) {
  const umDia = 24 * 60 * 60 * 1000;
  return Math.round((inicioDoDia(new Date(dataIso)).getTime() - inicioDoDia(hoje).getTime()) / umDia);
}

export function descreverQuando(dataIso: string) {
  const dias = diasAte(dataIso);
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  if (dias === -1) return 'Ontem';
  if (dias > 1) return `Em ${dias} dias`;
  return `Há ${Math.abs(dias)} dias`;
}

export function dataLocalSemFuso(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}T12:00:00`;
}
