// src/screens/RankingScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useUser } from '../context/UserContext';
import { db } from '../services/firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { colors } from '../styles/colors';
import { LEVEL_DATA } from '../utils/xpConfig';

type RankedUser = {
  id: string;
  name: string;
  level: number;
  xp: number;
};

type RankingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RankingScreen: React.FC = () => {
  const navigation = useNavigation<RankingScreenNavigationProp>();
  const { user: currentUser } = useUser();
  const [leaderboard, setLeaderboard] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(() => {
    setLoading(true);
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('xp', 'desc'), limit(50));

    getDocs(q)
      .then((querySnapshot) => {
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          level: doc.data().level,
          xp: doc.data().xp,
        })) as RankedUser[];
        setLeaderboard(leaderboardData);
      })
      .catch((error) => {
        console.error("Erro ao buscar o ranking:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
      return () => {};
    }, [fetchLeaderboard])
  );
  
  if (loading && leaderboard.length === 0) {
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
    
    const levelTitle = LEVEL_DATA[item.level]?.title ?? '';

    return (
      <TouchableOpacity
        style={[styles.rankItem, isCurrentUser && styles.currentUserItem]}
        onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.rankPosition}>
          {rankIcon ? (
            <Text style={styles.rankEmoji}>{rankIcon}</Text>
          ) : (
            <Text style={styles.rankNumber}>{rank}</Text>
          )}
        </View>
        <View style={styles.rankDetails}>
          <Text style={styles.rankName}>{item.name}</Text>
          <Text style={styles.rankLevel}>
            Nível {item.level} {levelTitle ? `· ${levelTitle}` : ''}
          </Text>
        </View>
        <Text style={styles.rankXp}>{item.xp} XP</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking Geral</Text>
      <Text style={styles.subtitle}>Os 50 maiores construtores do MOSAICO</Text>
      
      {loading && leaderboard.length > 0 && <ActivityIndicator style={{ marginVertical: 10 }} color={colors.primary} />}

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
    backgroundColor: '#3E8A81',
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