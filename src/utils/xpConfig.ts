// src/utils/xpConfig.ts


export const LEVEL_DATA: Record<number, { xpNeeded: number; title: string }> = {

  1: { xpNeeded: 0, title: 'Iniciante' },
  2: { xpNeeded: 100, title: 'Aprendiz' },
  3: { xpNeeded: 250, title: 'Explorador' },
  4: { xpNeeded: 500, title: 'Praticante' },
  5: { xpNeeded: 800, title: 'Construtor' },
  6: { xpNeeded: 1200, title: 'Artesão' },
  7: { xpNeeded: 1700, title: 'Especialista' },
  8: { xpNeeded: 2300, title: 'Mestre' },
  9: { xpNeeded: 3000, title: 'Visionário' },
  10: { xpNeeded: 4000, title: 'Mentor' },
  11: { xpNeeded: 5500, title: 'Lenda' },
  12: { xpNeeded: 7500, title: 'Ícone' },
  13: { xpNeeded: 10000, title: 'Titã' },
  14: { xpNeeded: 13000, title: 'Colosso' },
  15: { xpNeeded: 16500, title: 'Oráculo' },
  16: { xpNeeded: 20500, title: 'Arquiteto' },
  17: { xpNeeded: 25000, title: 'Pioneiro' },
  18: { xpNeeded: 30000, title: 'Virtuoso' },
  19: { xpNeeded: 36000, title: 'Iluminado' },
  20: { xpNeeded: 43000, title: 'Sábio' },
  21: { xpNeeded: 51000, title: 'Protetor' },
  22: { xpNeeded: 60000, title: 'Alquimista' },
  23: { xpNeeded: 70000, title: 'Desbravador' },
  24: { xpNeeded: 82000, title: 'Soberano' },
  25: { xpNeeded: 95000, title: 'Guardião' },
  26: { xpNeeded: 110000, title: 'Paradigma' },
  27: { xpNeeded: 130000, title: 'Eminência' },
  28: { xpNeeded: 155000, title: 'Ancestral' },
  29: { xpNeeded: 185000, title: 'Primordial' },
  30: { xpNeeded: 220000, title: 'Ascendente' },
};

/**
 * Calcula o progresso do nível atual com base no XP total do usuário.
 * @param totalXp O XP total acumulado pelo usuário.
 * @returns Um objeto com o nível atual, o título do nível, o XP ganho nesse nível,
 *          o XP necessário para o próximo nível e a porcentagem de progresso.
 */
export const calculateLevelProgress = (totalXp: number) => {
  let currentLevel = 1;
  const levels = Object.keys(LEVEL_DATA).map(Number);

  for (const level of levels) {
    if (totalXp >= LEVEL_DATA[level].xpNeeded) {
      currentLevel = level;
    } else {
      break;
    }
  }

  const currentLevelData = LEVEL_DATA[currentLevel];
  const nextLevelData = LEVEL_DATA[currentLevel + 1];


  if (!nextLevelData) {
    const xpEarnedPastMax = totalXp - currentLevelData.xpNeeded;
    return {
      currentLevel,
      levelTitle: currentLevelData.title,
      xpEarnedInCurrentLevel: xpEarnedPastMax,
      xpNeededForNextLevel: xpEarnedPastMax, 
      progressPercentage: 100,
    };
  }

  const currentLevelXp = currentLevelData.xpNeeded;
  const nextLevelXp = nextLevelData.xpNeeded;

  const xpEarnedInCurrentLevel = totalXp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;

  const progressPercentage =
    xpNeededForNextLevel > 0
      ? (xpEarnedInCurrentLevel / xpNeededForNextLevel) * 100
      : 100;

  return {
    currentLevel,
    levelTitle: currentLevelData.title,
    xpEarnedInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage: Math.min(progressPercentage, 100),
  };
};