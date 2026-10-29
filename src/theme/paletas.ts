export interface Paleta {
  fundo: string;
  superficie: string;
  superficieSuave: string;
  borda: string;
  texto: string;
  textoSecundario: string;
  titulo: string;
  primaria: string;
  primariaSuave: string;
  destaque: string;
  textoSobrePrimaria: string;
  perigo: string;
  perigoSuave: string;
  atencao: string;
  atencaoSuave: string;
  sucesso: string;
  sucessoSuave: string;
  sombra: string;
}

export const paletaClara: Paleta = {
  fundo: '#FAF9F5',
  superficie: '#FFFFFF',
  superficieSuave: '#EAF3E8',
  borda: '#E3ECE1',
  texto: '#173D3A',
  textoSecundario: '#6F7D79',
  titulo: '#0B4F4A',
  primaria: '#3F8F68',
  primariaSuave: '#EAF3E8',
  destaque: '#8FBE83',
  textoSobrePrimaria: '#FFFFFF',
  perigo: '#B3261E',
  perigoSuave: '#FCE8E6',
  atencao: '#9A6200',
  atencaoSuave: '#FFF3D6',
  sucesso: '#2E7D4F',
  sucessoSuave: '#E3F4E8',
  sombra: '#0B4F4A',
};

export const paletaEscura: Paleta = {
  fundo: '#0E1A18',
  superficie: '#162622',
  superficieSuave: '#1E332E',
  borda: '#26403A',
  texto: '#E4EFEA',
  textoSecundario: '#9BB0A9',
  titulo: '#9AD6B2',
  primaria: '#4FA77A',
  primariaSuave: '#1E332E',
  destaque: '#8FBE83',
  textoSobrePrimaria: '#FFFFFF',
  perigo: '#F2867E',
  perigoSuave: '#3A1F1D',
  atencao: '#F0C062',
  atencaoSuave: '#3A2F17',
  sucesso: '#7FD3A0',
  sucessoSuave: '#1B3527',
  sombra: '#000000',
};
