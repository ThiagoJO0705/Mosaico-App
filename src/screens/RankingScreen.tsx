// src/screens/RankingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { db } from '../services/firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

// Define a estrutura de dados para um usuário no ranking
type RankedUser = {
  id: string;
  name: string;
  level: number;
  xp: number;
};

const RankingScreen: React.FC = () => {
  const { user: currentUser } = useUser(); // Pega o usuário logado para destacá-lo
  const [leaderboard, setLeaderboard] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Cria uma referência para a coleção 'users'
        const usersCollection = collection(db, 'users');

        // Cria a query: ordenar por 'xp' em ordem decrescente e pegar os top 50
        const q = query(usersCollection, orderBy('xp', 'desc'), limit(50));

        const querySnapshot = await getDocs(q);
        
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          level: doc.data().level,
          xp: doc.data().xp,
        })) as RankedUser[];
        
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderRankItem = ({ item, index }: { item: RankedUser, index: number }) => {
    const isCurrentUser = currentUser?.uid === item.id;
    const rank = index + 1;
    let rankIcon;

    if (rank === 1) rankIcon = '🏆';
    else if (rank === 2) rankIcon = '🥈';
    else if (rank === 3) rankIcon = '🥉';

    return (
      <View style={[styles.rankItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankPosition}>
          {rankIcon ? (
            <Text style={styles.rankEmoji}>{rankIcon}</Text>
          ) : (
            <Text style={styles.rankNumber}>{rank}</Text>
          )}
        </View>
        <View style={styles.rankDetails}>
          <Text style={styles.rankName}>{item.name}</Text>
          <Text style={styles.rankLevel}>Nível {item.level}</Text>
        </View>
        <Text style={styles.rankXp}>{item.xp} XP</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking Geral</Text>
      <Text style={styles.subtitle}>Os 50 maiores construtores do MOSAICO</Text>

      <FlatList
        data={leaderboard}
        renderItem={renderRankItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <Text style={styles.emptyText}>O ranking ainda está sendo formado. Continue estudando!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: '#3E8A81', // Cor de destaque para o usuário atual
    borderColor: colors.primary,
    borderWidth: 1,
  },
  rankPosition: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  rankEmoji: {
    fontSize: 24,
  },
  rankDetails: {
    flex: 1,
  },
  rankName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rankLevel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rankXp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  }
});

export default RankingScreen;