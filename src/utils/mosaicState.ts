// src/utils/mosaicState.ts

export function getMosaicCoreColors(
  pieces: number,
  history: string[] | undefined,
  totalSegments: number
): string[] {
  const UNCONQUERED_GRAY = '#555555'; 
  const safeHistory = Array.isArray(history) ? history : [];

  const colors = Array(totalSegments).fill(UNCONQUERED_GRAY);


  for (let i = 0; i < pieces; i++) {

    if (i < safeHistory.length) {
      colors[i] = safeHistory[i];
    } else if (safeHistory.length > 0) {
      colors[i] = safeHistory[safeHistory.length - 1]; 
    }
  }

  return colors;
}