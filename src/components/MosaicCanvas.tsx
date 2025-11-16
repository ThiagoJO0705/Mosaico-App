// src/components/MosaicCanvas.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AreaId } from '../types/models';
import MosaicSvgM from './MosaicSvgM';

type Props = {
  stars: number;        // 0–5 (nível do mosaico)
  pieces: number;       // quantas peças o usuário já ganhou
  history: AreaId[];    // histórico de áreas (pra escolher cores)
};

const PALETTE: Record<AreaId, string> = {
  IA: '#4DB6AC',            // teal
  'Soft Skills': '#A3E6D5', // verde-menta
  ESG: '#D1C4E9',           // lilás
  Tech: '#FFD54F',          // âmbar
};

const TOTAL_SEGMENTS = 13;

const MosaicCanvas: React.FC<Props> = ({ stars, pieces, history }) => {
  // cores baseadas na história (últimas áreas estudadas)
  const baseColors =
    history.length > 0
      ? history.map((area) => PALETTE[area])
      : [PALETTE.IA, PALETTE['Soft Skills'], PALETTE.ESG, PALETTE.Tech];

  const pickColor = (index: number) =>
    baseColors[index % baseColors.length];

  // 👉 Caso 1: Nenhuma peça — M todo cinza
  if (pieces === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.glowSmall} />
        <MosaicSvgM size={180} baseColor="#555555" />
      </View>
    );
  }

  // 👉 Caso 2: Entre 1 e 13 peças — colorir segmentos 1 a 1
  if (pieces > 0 && pieces <= TOTAL_SEGMENTS) {
    // monta array de cores por segmento
    const segmentColors: string[] = [];

    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      if (i < pieces) {
        // segmento "ativo" ganha cor
        segmentColors[i] = pickColor(i);
      } else {
        // segmento ainda bloqueado fica cinza
        segmentColors[i] = '#555555';
      }
    }

    return (
      <View style={styles.wrapper}>
        <View style={styles.glowSmall} />
        <MosaicSvgM
          size={180}
          baseColor="#555555"
          segmentColors={segmentColors}
        />
      </View>
    );
  }

  // 👉 Caso 3: Muitas peças — usar formas artísticas (escudo, asas, mandala, cristal)
  // Aqui usamos apenas `stars` e as cores baseadas na história.

  const colors =
    baseColors.length > 0 ? baseColors.slice(-6) : baseColors;
  const c = (i: number) => colors[i % colors.length];

  return (
    <View style={styles.wrapper}>
      <View style={styles.glow} />

      {/* ⭐⭐ — escudo + núcleo */}
      {stars >= 2 && (
        <>
          <View style={[styles.coreSquare, { backgroundColor: c(0) }]} />
          <View style={[styles.blockVertical, styles.blockTop, { backgroundColor: c(1) }]} />
          <View style={[styles.blockVertical, styles.blockBottom, { backgroundColor: c(2) }]} />
          <View style={[styles.blockDiagonal, styles.blockLeft, { backgroundColor: c(3) }]} />
          <View style={[styles.blockDiagonal, styles.blockRight, { backgroundColor: c(4) }]} />
        </>
      )}

      {/* ⭐⭐⭐ — asas */}
      {stars >= 3 && (
        <>
          <View style={[styles.pill, styles.pillLeft, { backgroundColor: c(1) }]} />
          <View style={[styles.pill, styles.pillRight, { backgroundColor: c(2) }]} />

          <View style={[styles.pillSmall, styles.pillLeftTop, { backgroundColor: c(3) }]} />
          <View style={[styles.pillSmall, styles.pillRightTop, { backgroundColor: c(4) }]} />

          <View style={[styles.pillSmall, styles.pillLeftBottom, { backgroundColor: c(2) }]} />
          <View style={[styles.pillSmall, styles.pillRightBottom, { backgroundColor: c(1) }]} />
        </>
      )}

      {/* ⭐⭐⭐⭐ — mandala de pontos */}
      {stars >= 4 && (
        <>
          <View style={[styles.dot, styles.dotTop, { backgroundColor: c(0) }]} />
          <View style={[styles.dot, styles.dotBottom, { backgroundColor: c(1) }]} />
          <View style={[styles.dot, styles.dotLeft, { backgroundColor: c(2) }]} />
          <View style={[styles.dot, styles.dotRight, { backgroundColor: c(3) }]} />

          <View style={[styles.dot, styles.dotTL, { backgroundColor: c(4) }]} />
          <View style={[styles.dot, styles.dotTR, { backgroundColor: c(5) }]} />
          <View style={[styles.dot, styles.dotBL, { backgroundColor: c(0) }]} />
          <View style={[styles.dot, styles.dotBR, { backgroundColor: c(1) }]} />
        </>
      )}

      {/* ⭐⭐⭐⭐⭐ — anéis + brilhos */}
      {stars >= 5 && (
        <>
          <View style={[styles.ring, { borderColor: c(0) }]} />
          <View style={[styles.ringSmall, { borderColor: c(2) }]} />

          <View style={[styles.spark, { top: 18, left: 40, backgroundColor: c(3) }]} />
          <View style={[styles.spark, { top: 22, right: 36, backgroundColor: c(4) }]} />
          <View style={[styles.spark, { bottom: 20, left: 60, backgroundColor: c(1) }]} />
          <View style={[styles.spark, { bottom: 32, right: 52, backgroundColor: c(2) }]} />
        </>
      )}
    </View>
  );
};

const SIZE = 240;

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    borderRadius: 24,
    backgroundColor: '#3E3C30',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowSmall: {
    position: 'absolute',
    width: SIZE * 0.9,
    height: SIZE * 0.9,
    borderRadius: 999,
    backgroundColor: 'rgba(235,255,150,0.25)',
  },
  glow: {
    position: 'absolute',
    width: SIZE * 1.3,
    height: SIZE * 1.3,
    borderRadius: 999,
    backgroundColor: 'rgba(235,255,150,0.18)',
  },

  // Núcleo quadrado (nível 2+)
  coreSquare: {
    width: 90,
    height: 90,
    borderRadius: 18,
    transform: [{ rotate: '45deg' }],
  },

  // Blocos verticais
  blockVertical: {
    position: 'absolute',
    width: 36,
    height: 90,
    borderRadius: 18,
  },
  blockTop: { top: 22 },
  blockBottom: { bottom: 22 },

  // Blocos diagonais
  blockDiagonal: {
    position: 'absolute',
    width: 46,
    height: 110,
    borderRadius: 20,
  },
  blockLeft: {
    left: 20,
    transform: [{ rotate: '-30deg' }],
  },
  blockRight: {
    right: 20,
    transform: [{ rotate: '30deg' }],
  },

  // Asas (nível 3)
  pill: {
    position: 'absolute',
    width: 120,
    height: 26,
    borderRadius: 999,
    opacity: 0.9,
  },
  pillLeft: { left: -14 },
  pillRight: { right: -14 },

  pillSmall: {
    position: 'absolute',
    width: 42,
    height: 18,
    borderRadius: 999,
    opacity: 0.88,
  },
  pillLeftTop: { left: 14, top: 38 },
  pillRightTop: { right: 14, top: 38 },
  pillLeftBottom: { left: 14, bottom: 38 },
  pillRightBottom: { right: 14, bottom: 38 },

  // Mandala (nível 4)
  dot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 999,
    opacity: 0.9,
  },
  dotTop: { top: 14 },
  dotBottom: { bottom: 14 },
  dotLeft: { left: 14 },
  dotRight: { right: 14 },

  dotTL: { top: 28, left: 40 },
  dotTR: { top: 28, right: 40 },
  dotBL: { bottom: 28, left: 40 },
  dotBR: { bottom: 28, right: 40 },

  // Legado (nível 5)
  ring: {
    position: 'absolute',
    width: SIZE - 40,
    height: SIZE - 40,
    borderRadius: 999,
    borderWidth: 2,
    opacity: 0.6,
  },
  ringSmall: {
    position: 'absolute',
    width: SIZE - 80,
    height: SIZE - 80,
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.7,
  },
  spark: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
  },
});

export default MosaicCanvas;
