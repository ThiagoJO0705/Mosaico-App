// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, Unsubscribe } from 'firebase/firestore'; // Importa onSnapshot
import { auth, db } from '../services/firebaseConfig';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';
import { TRACKS } from '../data/tracks';
import { calculateLevelProgress } from '../utils/xpConfig';

export type MosaicBadge = {
  id: MosaicIndex;
  completedAt: string;
  history: string[];
};

export type TrackProgress = {
  completedLessons: number;
};

export type UserData = {
  uid: string;
  name: string;
  email: string;
  cpf: string;
  level: number;
  xp: number;
  streakDays: number;
  interests: string[];
  recommendedTrackIds: string[];
  trackProgress: Record<string, TrackProgress>;
  currentMosaicIndex: MosaicIndex;
  currentMosaicPieces: number;
  currentMosaicHistory: string[];
  mosaicBadges: MosaicBadge[];
};

type UserContextType = {
  user: UserData | null;
  loading: boolean;
  completeLesson: (trackId: string) => Promise<void>;
  updateInterestsAndRecommendations: (interests: string[]) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  completeLesson: async () => {},
  updateInterestsAndRecommendations: async () => {},
  logout: async () => {},
});

const getColorForTrack = (trackId: string): string => {
  const track = TRACKS.find((t) => t.id === trackId);
  return track?.color ?? '#A3E6D5';
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      // Se um listener do firestore de um usuário anterior existir, cancela a inscrição
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }

      if (firebaseUser) {
        // Usuário logou. Anexamos um listener ao seu documento no Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // onSnapshot cria uma conexão em tempo real.
        unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            // Sempre que o documento mudar no Firebase, este código roda e atualiza o estado.
            setUser({ uid: doc.id, ...doc.data() } as UserData);
          } else {
            console.error("Usuário autenticado mas sem dados no Firestore!");
            setUser(null); // Força o logout se os dados não existirem
          }
          setLoading(false);
        }, (error) => {
          console.error("Erro no listener do Firestore:", error);
          setUser(null);
          setLoading(false);
        });

      } else {
        // Usuário deslogou.
        setUser(null);
        setLoading(false);
      }
    });

    // Limpa o listener de autenticação quando o componente principal do app for desmontado
    return () => unsubscribeAuth();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const completeLesson = async (trackId: string) => {
    if (!user) return;

    const color = getColorForTrack(trackId);
    const trackData = TRACKS.find((t) => t.id === trackId);
    const userDocRef = doc(db, 'users', user.uid);
    
    // Atualizações são feitas diretamente no Firestore. O onSnapshot atualizará o estado local.
    const newXp = user.xp + (trackData?.rewardXp ?? 10);
    const { currentLevel } = calculateLevelProgress(newXp);
    const currentTrackProgress = user.trackProgress[trackId] ?? { completedLessons: 0 };
    const newCompleted = currentTrackProgress.completedLessons + 1;
    const newTrackProgress = { ...user.trackProgress, [trackId]: { completedLessons: newCompleted } };
    const newPieces = user.currentMosaicPieces + 1;
    const newHistory = [...user.currentMosaicHistory, color];
    const totalNeeded = MOSAICO_SEGMENTS[user.currentMosaicIndex];

    let updates: Partial<UserData> = {
      level: currentLevel,
      xp: newXp,
      trackProgress: newTrackProgress,
      currentMosaicPieces: newPieces,
      currentMosaicHistory: newHistory,
    };

    if (newPieces >= totalNeeded) {
      const newBadge: MosaicBadge = {
        id: user.currentMosaicIndex,
        completedAt: new Date().toLocaleDateString('pt-BR'),
        history: newHistory,
      };
      updates = {
        ...updates,
        mosaicBadges: [...user.mosaicBadges, newBadge],
        currentMosaicIndex: (user.currentMosaicIndex + 1) as MosaicIndex,
        currentMosaicPieces: 0,
        currentMosaicHistory: [],
      };
    }
    
    await updateDoc(userDocRef, updates);
  };
  
  const updateInterestsAndRecommendations = async (interests: string[]) => {
    if (!user) return;

    let recommendedIds: string[] = [];
    try {
      const trackListForPrompt = TRACKS.map((t) => `${t.id} (${t.area})`).join(', ');
      const prompt = `
        O usuário do app MOSAICO atualizou seus interesses para: ${interests.join(', ')}.
        Temos as seguintes trilhas disponíveis (id - área): ${trackListForPrompt}.
        Escolha de 2 a 4 trilhas que façam mais sentido para esse usuário.
        Responda APENAS um JSON no formato: {"tracks":["id-1","id-2","id-3"]}.
      `;
      const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY';
      const resp = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.tracks)) {
          recommendedIds = parsed.tracks.filter((id: string) => TRACKS.some((t) => t.id === id));
        }
      }
    } catch (e) {
      console.error("Erro ao chamar API Gemini, usando fallback:", e);
    }

    if (recommendedIds.length === 0) {
      recommendedIds = TRACKS.filter((t) => interests.includes(t.area)).slice(0, 3).map((t) => t.id);
    }
    
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { interests, recommendedTrackIds: recommendedIds });
  };

  return (
    <UserContext.Provider value={{ user, loading, completeLesson, updateInterestsAndRecommendations, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);