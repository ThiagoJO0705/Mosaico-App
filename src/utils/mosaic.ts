// src/utils/mosaic.ts

export function getMosaicStarsFromPieces(pieces: number): number {
  if (pieces >= 61) return 5; 
  if (pieces >= 37) return 4; 
  if (pieces >= 21) return 3; 
  if (pieces >= 9) return 2;  
  if (pieces > 0) return 1;  
  return 0;                  
}


export function renderStars(count: number, max: number = 5): string {
  const c = Math.max(0, Math.min(count, max));
  const filled = '★'.repeat(c);
  const empty = '☆'.repeat(max - c);
  return filled + empty;
}
