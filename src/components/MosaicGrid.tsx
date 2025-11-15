// src/components/MosaicGrid.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AreaId } from '../types/models';

type Props = {
  history: AreaId[];
};

const AREA_COLORS: Record<AreaId, string> = {
  IA: '#0EA5E9',           // azul
  'Soft Skills': '#22C55E', // verde
  ESG: '#A855F7',          // roxo
  Tech: '#F97316',         // laranja
};

const MAX_PIECES = 40;

const MosaicGrid: React.FC<Props> = ({ history }) => {
  // mostra apenas as últimas N peças para não poluir visualmente
  const pieces = history.slice(-MAX_PIECES);

  if (pieces.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyPiece} />
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {pieces.map((area, index) => (
        <View
          key={index}
          style={[styles.piece, { backgroundColor: AREA_COLORS[area] }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  piece: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  emptyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  emptyPiece: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
});

export default MosaicGrid;
