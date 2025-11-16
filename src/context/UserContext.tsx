// src/context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';
import { TRACKS } from '../data/tracks'; // 👈 adiciona isso

export type MosaicBadge = {
  id: MosaicIndex;
  completedAt: string;
  history: string[]; // 🔹 novo: histórico de cores daquele mosaico
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

  addPieceToMosaic: (color?: string) => void;
  resetMosaic: () => void;
  completeLesson: (trackId: string) => void;

  syncFromFirebase?: (data: Partial<UserData>) => void;
};

// 🎨 mapa de cores por trilha — ajuste os IDs para bater com o seu TRACKS
const getColorForTrack = (trackId: string): string => {
  const track = TRACKS.find((t) => t.id === trackId);
  // se achar a trilha, usa a cor dela; se não, cai num fallback
  return track?.color ?? '#A3E6D5';
};

const initialUser: UserData = {
  uid: '123',
  name: 'Fabio',

  level: 1,
  xp: 0,
  streakDays: 1,

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
  addPieceToMosaic: () => {},
  resetMosaic: () => {},
  completeLesson: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData>(initialUser);
  const [loading] = useState(false);

  // 🔹 Ganhar uma peça do mosaico
  const addPieceToMosaic = (color: string = '#A3E6D5') => {
    setUser((prev) => {
      const totalNeeded = MOSAICO_SEGMENTS[prev.currentMosaicIndex];
      const newPieces = prev.currentMosaicPieces + 1;
      const newHistory = [...prev.currentMosaicHistory, color];

      let updated: UserData = {
        ...prev,
        currentMosaicPieces: newPieces,
        currentMosaicHistory: newHistory,
        xp: prev.xp + 10,
        progress: Math.min(100, prev.progress + 3),
      };

      // completou o mosaico atual?
      if (newPieces >= totalNeeded) {
        const badge: MosaicBadge = {
          id: prev.currentMosaicIndex,
          completedAt: new Date().toLocaleDateString('pt-BR'),
          history: newHistory, // 🔹 guarda as cores do mosaico completo
        };

        updated = {
          ...updated,
          mosaicBadges: [...prev.mosaicBadges, badge],
          currentMosaicIndex: (prev.currentMosaicIndex + 1) as MosaicIndex,
          currentMosaicPieces: 0,
          currentMosaicHistory: [],
          level: prev.level + 1,
        };
      }

      return updated;
    });
  };

  const resetMosaic = () => {
    setUser((prev) => ({
      ...prev,
      currentMosaicPieces: 0,
      currentMosaicHistory: [],
    }));
  };

  // 🔹 Concluir 1 aula de uma trilha específica
  const completeLesson = (trackId: string) => {
    // 1) update do progresso da trilha, aulas e progress geral
    setUser((prev) => {
      const currentTrack = prev.trackProgress[trackId] ?? {
        completedLessons: 0,
      };
      const newCompleted = currentTrack.completedLessons + 1;

      const newTrackProgress: Record<string, TrackProgress> = {
        ...prev.trackProgress,
        [trackId]: { completedLessons: newCompleted },
      };

      return {
        ...prev,
        trackProgress: newTrackProgress,
        lessonsCompleted: prev.lessonsCompleted + 1,
        progress: Math.min(100, prev.progress + 5),
      };
    });

    // 2) dar a peça no mosaico com a cor da trilha
    const color = getColorForTrack(trackId);
    addPieceToMosaic(color);
  };

  const syncFromFirebase = (data: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        addPieceToMosaic,
        resetMosaic,
        completeLesson,
        syncFromFirebase,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
