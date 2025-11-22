// src/utils/mosaicConfig.ts
export const MOSAICO_SEGMENTS = {
  1: 9,    
  2: 22,   
  3: 50,  
  4: 66,
  5: 150,
} as const;

export type MosaicIndex = keyof typeof MOSAICO_SEGMENTS;
