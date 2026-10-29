import { storage } from '@/lib/storage';

export interface RegistroDeAvisos {
  mensagens?: string[];
  eventos?: number[];
}

function chave(idUsuario: number) {
  return `avisos-${idUsuario}`;
}

export async function lerRegistro(idUsuario: number): Promise<RegistroDeAvisos> {
  const salvo = await storage.getItem(chave(idUsuario));
  return salvo ? (JSON.parse(salvo) as RegistroDeAvisos) : {};
}

export async function gravarRegistro(idUsuario: number, registro: RegistroDeAvisos) {
  await storage.setItem(chave(idUsuario), JSON.stringify(registro));
}
