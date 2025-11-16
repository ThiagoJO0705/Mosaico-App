// src/utils/mosaic.ts

/**
 * Nível do mosaico (0 a 5 estrelas) baseado na quantidade de peças.
 *
 * Nível 1 (1 ⭐ — Fundamento)      -> começou a jornada
 * Nível 2 (2 ⭐ — Construtor)      -> completou o "M" (por volta de 9+ peças)
 * Nível 3 (3 ⭐ — Conector)        -> expandindo em diferentes áreas
 * Nível 4 (4 ⭐ — Especialista)    -> mandala mais complexa
 * Nível 5 (5 ⭐ — Legado)          -> cristal orgânico
 */
export function getMosaicStarsFromPieces(pieces: number): number {
  if (pieces >= 61) return 5; // Legado
  if (pieces >= 37) return 4; // Especialista
  if (pieces >= 21) return 3; // Conector
  if (pieces >= 9) return 2;  // Construtor
  if (pieces > 0) return 1;   // Fundamento
  return 0;                   // ainda sem mosaico
}

/**
 * Retorna uma string de estrelas tipo: ★★★☆☆
 */
export function renderStars(count: number, max: number = 5): string {
  const c = Math.max(0, Math.min(count, max));
  const filled = '★'.repeat(c);
  const empty = '☆'.repeat(max - c);
  return filled + empty;
}
