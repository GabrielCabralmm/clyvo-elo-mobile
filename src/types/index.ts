export type Papel = 'Tutor' | 'Doutor';

export interface LoginResponse {
  token: string;
  papel: Papel;
  id: number;
  nome: string;
}

export interface CadastroTutorRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface Pet {
  idPet: number;
  idTutor: number;
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  pesoKg?: number;
}

export interface NovoPet {
  idTutor: number;
  nome: string;
  especie: string;
  raca?: string;
  pesoKg?: number;
}

export interface EventoClinico {
  idEvento: number;
  idPet: number;
  idDoutor: number;
  tipoEvento: string;
  descricao?: string;
  dataEvento: string;
  status: string;
}

export interface NovoEventoClinico {
  idPet: number;
  idDoutor: number;
  tipoEvento: string;
  descricao?: string;
  dataEvento: string;
  status: string;
}
