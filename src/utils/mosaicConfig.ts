// src/utils/mosaicConfig.ts
export const MOSAICO_SEGMENTS = {
  1: 9,    // M
  2: 21,   // Escudo
  3: 54,   // Este mosaico 3 novo
  4: 60,
  5: 80,
} as const;

export type MosaicIndex = keyof typeof MOSAICO_SEGMENTS;
