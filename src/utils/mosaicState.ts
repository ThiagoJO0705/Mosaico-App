// src/utils/mosaicState.ts

/**
 * Gera as cores de cada segmento do mosaico.
 * - pieces = quantas peças já foram conquistadas
 * - history = lista de cores (uma por peça conquistada, na ordem)
 * - totalSegments = número total de segmentos do mosaico atual
 *
 * Regra:
 *   - Para i < history.length → usa history[i] (cor da conquista)
 *   - Para i >= history.length e i < pieces → usa uma cor padrão
 *   - Para o resto → cinza base (não conquistado)
 */
export function getMosaicCoreColors(
  pieces: number,
  history: string[] | undefined,
  totalSegments: number
): string[] {
  const BASE_GRAY = '#555555';
  const FALLBACK_COLOR = '#A3E6D5'; // caso haja peça sem cor no histórico

  const safeHistory = Array.isArray(history) ? history : [];
  const colors: string[] = [];

  for (let i = 0; i < totalSegments; i++) {
    if (i < safeHistory.length) {
      // usa exatamente a cor que foi guardada ao conquistar essa peça
      colors.push(safeHistory[i]);
    } else if (i < pieces) {
      // tem peça mas não tem cor correspondente no histórico
      colors.push(FALLBACK_COLOR);
    } else {
      // não conquistado ainda
      colors.push(BASE_GRAY);
    }
  }

  return colors;
}
