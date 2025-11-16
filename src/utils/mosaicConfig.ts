// src/utils/mosaicConfig.ts

export const MOSAICO_SEGMENTS = {
  1: 9,   // Mosaico 1 — SVG "M"
  2: 26,  // Mosaico 2 — Escudo
  3: 40,
  4: 60,
  5: 80,
} as const;

export type MosaicIndex = keyof typeof MOSAICO_SEGMENTS; // 1 | 2 | 3 | 4 | 5
