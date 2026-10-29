export interface AvisoLocal {
  titulo: string;
  corpo: string;
  rota: string;
}

export interface LembreteAgendado extends AvisoLocal {
  identificador: string;
  quando: Date;
}
