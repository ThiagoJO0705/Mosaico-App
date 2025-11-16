// src/utils/mosaicConfig.ts
export const MOSAICO_SEGMENTS = {
  1: 9,    // M
  2: 22,   // Escudo
  3: 50,   // Este mosaico 3 novo
  4: 66,
  5: 150,
} as const;

export type MosaicIndex = keyof typeof MOSAICO_SEGMENTS;
