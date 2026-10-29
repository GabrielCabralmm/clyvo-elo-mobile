import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTema } from '@/contexts/TemaContext';
import { Paleta } from '@/theme/paletas';

export function useEstilos<T extends StyleSheet.NamedStyles<T>>(criarEstilos: (cores: Paleta) => T) {
  const { cores } = useTema();
  return useMemo(() => StyleSheet.create(criarEstilos(cores)), [cores, criarEstilos]);
}
