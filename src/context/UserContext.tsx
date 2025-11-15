// src/context/UserContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { BadgeId, UserGamification, AreaId } from '../types/models';
import { TRACKS } from '../data/tracks';

type UserContextValue = {
  user: UserGamification;
  completeLesson: (trackId: string) => void;
  registerDailyLogin: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const initialUser: UserGamification = {
  name: 'Aluno MOSAICO',
  level: 1,
  xp: 0,
  pieces: 0,
  piecesHistory: [],
  streak: 1,
  badges: [],
  progress: {},
};

type Props = {
  children: ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<UserGamification>(initialUser);

  const addBadge = (userState: UserGamification, newBadge: BadgeId): BadgeId[] => {
    if (userState.badges.includes(newBadge)) return userState.badges;
    return [...userState.badges, newBadge];
  };

  const recalculateLevel = (xp: number): number => {
    // regra simples: a cada 100 XP sobe de nível
    return Math.floor(xp / 100) + 1;
  };

  const completeLesson = (trackId: string) => {
    setUser((prev) => {
      const track = TRACKS.find((t) => t.id === trackId);
      const area: AreaId = track?.area ?? 'Tech';

      const prevProgress = prev.progress[trackId]?.completedLessons ?? 0;
      const completedLessons = prevProgress + 1;

      const updatedProgress = {
        ...prev.progress,
        [trackId]: { completedLessons },
      };

      const gainedXp = 20;

      // histórico de peças: adiciona a área no final do array
      const newPiecesHistory = [...prev.piecesHistory, area];
      const newTotalPieces = newPiecesHistory.length;

      let newBadges = [...prev.badges];

      if (newTotalPieces === 1) {
        newBadges = addBadge(
          { ...prev, badges: newBadges },
          'first_trail',
        );
      }
      if (newTotalPieces === 10) {
        newBadges = addBadge(
          { ...prev, badges: newBadges },
          'pieces_10',
        );
      }
      if (newTotalPieces === 50) {
        newBadges = addBadge(
          { ...prev, badges: newBadges },
          'pieces_50',
        );
      }

      const newXp = prev.xp + gainedXp;
      const newLevel = recalculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        pieces: newTotalPieces,
        piecesHistory: newPiecesHistory,
        level: newLevel,
        progress: updatedProgress,
        badges: newBadges,
      };
    });
  };

  const registerDailyLogin = useCallback(() => {
    setUser((prev) => {
      const newStreak = prev.streak + 1;
      let newBadges = [...prev.badges];

      if (newStreak >= 3) {
        newBadges = addBadge(prev, 'streak_3');
      }

      return {
        ...prev,
        streak: newStreak,
        badges: newBadges,
      };
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, completeLesson, registerDailyLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
