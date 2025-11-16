// src/data/tracks.ts

export type Track = {
  id: string;
  title: string;
  totalLessons: number;
  color: string; // 🎨 cor da trilha para o mosaico
};

export const TRACKS: Track[] = [
  {
    id: 'ia-basics',
    title: 'Fundamentos de IA',
    totalLessons: 8,
    color: '#4DB6AC', // teal
  },
  {
    id: 'softskills',
    title: 'Soft Skills para o Futuro',
    totalLessons: 6,
    color: '#D1C4E9', // lilás
  },
  {
    id: 'esg',
    title: 'ESG e Sustentabilidade',
    totalLessons: 5,
    color: '#FFD54F', // âmbar
  },
  //adicione aqui as demais trilhas com suas cores
];
