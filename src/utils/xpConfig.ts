// src/utils/xpConfig.ts

// Define o XP TOTAL necessário para ALCANÇAR cada nível.
// Nível 1 é o início (0 XP). Para chegar ao Nível 2, precisa de 100 XP total, etc.
export const LEVEL_XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 4000,
  // Adicione mais níveis conforme necessário
};

/**
 * Calcula o progresso do nível atual com base no XP total do usuário.
 * @param totalXp O XP total acumulado pelo usuário.
 * @returns Um objeto com o nível atual, o XP ganho nesse nível,
 *          o XP necessário para o próximo nível e a porcentagem de progresso.
 */
export const calculateLevelProgress = (totalXp: number) => {
  let currentLevel = 1;
  let nextLevelXp = LEVEL_XP_THRESHOLDS[2];
  let currentLevelXp = LEVEL_XP_THRESHOLDS[1];

  // 1. Encontrar o nível atual do usuário
  for (const level in LEVEL_XP_THRESHOLDS) {
    if (totalXp >= LEVEL_XP_THRESHOLDS[level]) {
      currentLevel = parseInt(level, 10);
    } else {
      break; // Sai do loop assim que encontrar um nível que o usuário não alcançou
    }
  }

  // 2. Definir o XP do nível atual e do próximo
  currentLevelXp = LEVEL_XP_THRESHOLDS[currentLevel];
  nextLevelXp = LEVEL_XP_THRESHOLDS[currentLevel + 1] ?? totalXp; // Se for o nível máximo, o próximo é o XP atual

  // 3. Calcular o XP ganho DESDE o início do nível atual
  const xpEarnedInCurrentLevel = totalXp - currentLevelXp;

  // 4. Calcular o total de XP necessário PARA PASSAR deste nível
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;

  // 5. Calcular a porcentagem (e garantir que não divida por zero)
  const progressPercentage =
    xpNeededForNextLevel > 0
      ? (xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100
      : 100;

  return {
    currentLevel,
    xpEarnedInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage: Math.min(progressPercentage, 100), // Garante que não passe de 100%
  };
};