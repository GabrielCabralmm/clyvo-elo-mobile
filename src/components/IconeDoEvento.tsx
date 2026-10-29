import { ClipboardList, Microscope, Pill, Scissors, Stethoscope, Syringe } from 'lucide-react-native';
import { TipoEvento } from '@/types';

export const ICONE_DO_EVENTO: Record<TipoEvento, typeof Syringe> = {
  VACINA: Syringe,
  CHECKUP: Stethoscope,
  POS_OPERATORIO: Scissors,
  MEDICACAO: Pill,
  EXAME: Microscope,
};

export function iconeDoEvento(tipo: TipoEvento) {
  return ICONE_DO_EVENTO[tipo] ?? ClipboardList;
}
