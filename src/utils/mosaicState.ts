// src/utils/mosaicState.ts

/**
 * Gera as cores para cada segmento de um mosaico.
 */
export function getMosaicCoreColors(
  pieces: number,
  history: string[] | undefined,
  totalSegments: number
): string[] {
  const UNCONQUERED_GRAY = '#555555'; // Peça ainda não ganha
  const safeHistory = Array.isArray(history) ? history : [];

  const colors = Array(totalSegments).fill(UNCONQUERED_GRAY);

  // Pinta as peças que foram conquistadas.
  // O loop vai até o número de peças ganhas.
  for (let i = 0; i < pieces; i++) {
    // Se houver uma cor no histórico para esta peça, use-a.
    // Senão, use a cor da peça anterior (ou a primeira, como fallback).
    // Isso evita o uso de uma cor genérica e mantém o visual mais consistente.
    if (i < safeHistory.length) {
      colors[i] = safeHistory[i];
    } else if (safeHistory.length > 0) {
      colors[i] = safeHistory[safeHistory.length - 1]; // Repete a última cor conhecida
    }
  }

  return colors;
}