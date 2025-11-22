// src/types/models.ts

export type AreaId = 'IA' | 'Soft Skills' | 'ESG' | 'Tech';

export type Track = {
  id: string;
  title: string;
  area: AreaId;
  totalLessons: number;
};

export type UserProgress = {
  [trackId: string]: {
    completedLessons: number;
  };
};

export type BadgeId =
  | 'first_trail'
  | 'streak_3'
  | 'pieces_10'
  | 'pieces_50';

export type UserGamification = {
  name: string;
  level: number;
  xp: number;
  pieces: number; 
  piecesHistory: AreaId[]; 
  streak: number;
  badges: BadgeId[];
  progress: UserProgress;
};
