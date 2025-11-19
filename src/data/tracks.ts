// src/data/tracks.ts

export type TrackArea =
  | 'Tecnologia'
  | 'Soft Skills'
  | 'ESG'
  | 'Dados'
  | 'Liderança'
  | 'Produtividade';

export type Track = {
  id: string;
  title: string;
  totalLessons: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  area: TrackArea;
  durationMinutes: number;
  rewardPieces: number;
  rewardXp: number;
  description: string;
  color: string;        // 👈 ADICIONADO
};

const AREA_COLORS: Record<TrackArea, string> = {
  Tecnologia: '#4DB6AC',
  'Soft Skills': '#D1C4E9',
  ESG: '#FFD54F',
  Dados: '#A3E6D5',
  Liderança: '#90CAF9',
  Produtividade: '#FFAB91',
};

export const TRACKS: Track[] = [
  {
    id: 'ia-fundamentos',
    title: 'Fundamentos de IA',
    totalLessons: 22,
    difficulty: 'Iniciante',
    area: 'Tecnologia',
    durationMinutes: 600,
    rewardPieces: 1,
    rewardXp: 80,
    description: 'Entenda os conceitos essenciais de inteligência artificial.',
    color: AREA_COLORS['Tecnologia'],
  },
  {
    id: 'softskills-futuro',
    title: 'Soft Skills para o Futuro',
    totalLessons: 18,
    difficulty: 'Intermediário',
    area: 'Soft Skills',
    durationMinutes: 540,
    rewardPieces: 1,
    rewardXp: 60,
    description:
      'Desenvolva comunicação, colaboração e adaptabilidade para o novo trabalho.',
    color: AREA_COLORS['Soft Skills'],
  },
  {
    id: 'esg-basico',
    title: 'ESG e Sustentabilidade',
    totalLessons: 15,
    difficulty: 'Iniciante',
    area: 'ESG',
    durationMinutes: 250,
    rewardPieces: 1,
    rewardXp: 50,
    description:
      'Descubra como ESG impacta negócios, investimentos e decisões estratégicas.',
    color: AREA_COLORS['ESG'],
  },
  {
    id: 'dados-essenciais',
    title: 'Dados para Decisão',
    totalLessons: 16,
    difficulty: 'Intermediário',
    area: 'Dados',
    durationMinutes: 210,
    rewardPieces: 1,
    rewardXp: 70,
    description:
      'Aprenda a interpretar dashboards, métricas e análises para decidir melhor.',
    color: AREA_COLORS['Dados'],
  },
  {
    id: 'lideranca-1',
    title: 'Liderança na Prática',
    totalLessons: 12,
    difficulty: 'Intermediário',
    area: 'Liderança',
    durationMinutes: 320,
    rewardPieces: 1,
    rewardXp: 80,
    description:
      'Conduza times com clareza, confiança e foco em resultados sustentáveis.',
    color: AREA_COLORS['Liderança'],
  },
  {
    id: 'produtividade-adv',
    title: 'Produtividade Inteligente',
    totalLessons: 9,
    difficulty: 'Iniciante',
    area: 'Produtividade',
    durationMinutes: 180,
    rewardPieces: 1,
    rewardXp: 60,
    description:
      'Organize sua rotina, priorize o que importa e reduza o estresse diário.',
    color: AREA_COLORS['Produtividade'],
  },
  {
    id: 'comunicacao-oratoria',
    title: 'Comunicação & Oratória',
    totalLessons: 19,
    difficulty: 'Intermediário',
    area: 'Soft Skills',
    durationMinutes: 450,
    rewardPieces: 1,
    rewardXp: 70,
    description:
      'Aprenda a se posicionar com segurança em reuniões, apresentações e negociações.',
    color: AREA_COLORS['Soft Skills'],
  },
  {
    id: 'ia-no-dia-a-dia',
    title: 'IA no Dia a Dia',
    totalLessons: 21,
    difficulty: 'Iniciante',
    area: 'Tecnologia',
    durationMinutes: 450,
    rewardPieces: 1,
    rewardXp: 50,
    description:
      'Use IA generativa para ganhar tempo em pesquisas, textos e decisões.',
    color: AREA_COLORS['Tecnologia'],
  },
];
