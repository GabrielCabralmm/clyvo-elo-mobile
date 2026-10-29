import { Especie, NovoPet } from '@/types';

export const ESPECIES: { valor: Especie; rotulo: string }[] = [
  { valor: 'CACHORRO', rotulo: 'Cachorro' },
  { valor: 'GATO', rotulo: 'Gato' },
];

export const PESO_MAXIMO_KG = 150;

export type Validacao<T> = { ok: true; valor: T } | { ok: false; erro: string };

export function ehGato(especie: string) {
  return especie?.toUpperCase() === 'GATO';
}

export function rotuloDaEspecie(especie: string) {
  return ESPECIES.find((e) => e.valor === especie?.toUpperCase())?.rotulo ?? especie;
}

export function formatarPeso(pesoKg?: number) {
  if (!pesoKg) {
    return undefined;
  }
  return `${String(pesoKg).replace('.', ',')} kg`;
}

export function interpretarPeso(texto: string): Validacao<number> {
  const valor = Number(texto.trim().replace(',', '.'));
  if (!texto.trim() || Number.isNaN(valor) || valor <= 0) {
    return { ok: false, erro: 'Digite um peso válido, maior que zero.' };
  }
  if (valor > PESO_MAXIMO_KG) {
    return { ok: false, erro: `O peso não pode passar de ${PESO_MAXIMO_KG} kg.` };
  }
  return { ok: true, valor: Math.round(valor * 100) / 100 };
}

export function validarNovoPet(nome: string, especie: Especie, raca: string, pesoTexto: string): Validacao<NovoPet> {
  if (!nome.trim()) {
    return { ok: false, erro: 'Digite o nome do pet.' };
  }

  let pesoKg: number | undefined;
  if (pesoTexto.trim()) {
    const peso = interpretarPeso(pesoTexto);
    if (!peso.ok) {
      return peso;
    }
    pesoKg = peso.valor;
  }

  return { ok: true, valor: { nome: nome.trim(), especie, raca: raca.trim() || undefined, pesoKg } };
}

export function idadeDoPet(dataNascimento?: string) {
  if (!dataNascimento) {
    return undefined;
  }
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) {
    anos -= 1;
  }
  if (anos >= 1) {
    return anos === 1 ? '1 ano' : `${anos} anos`;
  }
  const meses = Math.max((hoje.getFullYear() - nascimento.getFullYear()) * 12 + hoje.getMonth() - nascimento.getMonth(), 0);
  return meses === 1 ? '1 mês' : `${meses} meses`;
}
