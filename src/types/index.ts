export type Papel = 'Tutor' | 'Doutor';

export type TipoEvento = 'VACINA' | 'CHECKUP' | 'POS_OPERATORIO' | 'MEDICACAO' | 'EXAME';

export type StatusEvento = 'PENDENTE' | 'CONCLUIDO' | 'ATRASADO';

export type CategoriaMensagem = 'POS_OPERATORIO' | 'MEDICACAO' | 'ORIENTACAO' | 'RETORNO';

export type Especie = 'CACHORRO' | 'GATO';

export interface Link {
  href: string;
  rel: string;
  metodo: string;
}

export interface Pagina<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
  links: Link[];
}

export interface LoginResponse {
  token: string;
  expiraEm: string;
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
  nomeTutor?: string;
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  pesoKg?: number;
}

export interface NovoPet {
  nome: string;
  especie: Especie;
  raca?: string;
  pesoKg?: number;
}

export interface EventoClinico {
  idEvento: number;
  idPet: number;
  nomePet?: string;
  idDoutor: number;
  nomeDoutor?: string;
  tipoEvento: TipoEvento;
  descricao?: string;
  dataEvento: string;
  status: StatusEvento;
}

export interface NovoEventoClinico {
  idPet: number;
  tipoEvento: TipoEvento;
  descricao?: string;
  dataEvento: string;
}

export interface Mensagem {
  id: string;
  idPet: number;
  nomePet: string;
  idTutor: number;
  idDoutor: number;
  nomeDoutor: string;
  categoria: CategoriaMensagem;
  assunto: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  dataLeitura?: string;
}

export interface NovaMensagem {
  idPet: number;
  categoria: CategoriaMensagem;
  assunto: string;
  conteudo: string;
}
