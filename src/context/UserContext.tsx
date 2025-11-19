// src/context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';
import { TRACKS } from '../data/tracks';

export type MosaicBadge = {
  id: MosaicIndex;
  completedAt: string;
  history: string[]; // histórico de cores daquele mosaico
};

export type TrackProgress = {
  completedLessons: number;
};

export type UserData = {
  uid: string;
  name: string;
  level: number;
  xp: number;
  streakDays: number;
  interests?: string[];
  recommendedTrackIds?: string[];
  password?: string;
  cpf?: string;
  activeTracksCount: number;
  lessonsCompleted: number;
  areasExplored: number;
  progress: number;
  trackProgress: Record<string, TrackProgress>;
  currentMosaicIndex: MosaicIndex;
  currentMosaicPieces: number;
  currentMosaicHistory: string[];
  mosaicBadges: MosaicBadge[];
};

type UserContextType = {
  user: UserData;
  loading: boolean;
  completeLesson: (trackId: string) => void;
  updateInterests: (interests: string[]) => void;
  setRecommendedTracks: (trackIds: string[]) => void;
  syncFromFirebase?: (data: Partial<UserData>) => void;
};

const getColorForTrack = (trackId: string): string => {
  const track = TRACKS.find((t) => t.id === trackId);
  return track?.color ?? '#A3E6D5';
};

const initialUser: UserData = {
  uid: '123',
  name: 'Fabio',
  level: 1,
  xp: 0,
  streakDays: 1,
  interests: [],
  recommendedTrackIds: [],
  password: undefined,
  cpf: undefined,
  activeTracksCount: 0,
  lessonsCompleted: 0,
  areasExplored: 0,
  progress: 0,
  trackProgress: {},
  currentMosaicIndex: 1,
  currentMosaicPieces: 0,
  currentMosaicHistory: [],
  mosaicBadges: [],
};

const UserContext = createContext<UserContextType>({
  user: initialUser,
  loading: false,
  completeLesson: () => {},
  updateInterests: () => {},
  setRecommendedTracks: () => {},
  syncFromFirebase: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData>(initialUser);
  const [loading] = useState(false);

  // MODIFICAÇÃO: A função completeLesson foi reescrita para ser uma transação atômica.
  const completeLesson = (trackId: string) => {
    const color = getColorForTrack(trackId);
    const trackData = TRACKS.find((t) => t.id === trackId);

    setUser((prev) => {
      if (!prev) return prev; // Proteção

      // 1. Atualiza progresso da trilha
      const currentTrackProgress = prev.trackProgress[trackId] ?? {
        completedLessons: 0,
      };
      const newCompleted = currentTrackProgress.completedLessons + 1;
      const newTrackProgress = {
        ...prev.trackProgress,
        [trackId]: { completedLessons: newCompleted },
      };

      // 2. Atualiza peças e histórico do mosaico
      const newPieces = prev.currentMosaicPieces + 1;
      const newHistory = [...prev.currentMosaicHistory, color];
      const totalNeeded = MOSAICO_SEGMENTS[prev.currentMosaicIndex];

      let updatedUser: UserData = {
        ...prev,
        trackProgress: newTrackProgress,
        lessonsCompleted: prev.lessonsCompleted + 1,
        xp: prev.xp + (trackData?.rewardXp ?? 10), // Usa XP da trilha
        progress: Math.min(100, prev.progress + 5),
        currentMosaicPieces: newPieces,
        currentMosaicHistory: newHistory,
      };

      // 3. Verifica se o mosaico foi completado
      if (newPieces >= totalNeeded) {
        const newBadge: MosaicBadge = {
          id: prev.currentMosaicIndex,
          completedAt: new Date().toLocaleDateString('pt-BR'),
          history: newHistory,
        };

        updatedUser = {
          ...updatedUser,
          mosaicBadges: [...prev.mosaicBadges, newBadge],
          currentMosaicIndex: (prev.currentMosaicIndex + 1) as MosaicIndex,
          currentMosaicPieces: 0,
          currentMosaicHistory: [],
          level: prev.level + 1, // Sobe de nível ao completar um mosaico
        };
      }

      return updatedUser;
    });
  };

  const syncFromFirebase = (data: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const updateInterests = (interests: string[]) => {
    setUser((prev) => ({ ...prev, interests }));
  };

  const setRecommendedTracks = (trackIds: string[]) => {
    setUser((prev) => ({ ...prev, recommendedTrackIds: trackIds }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        completeLesson,
        updateInterests,
        setRecommendedTracks,
        syncFromFirebase,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);