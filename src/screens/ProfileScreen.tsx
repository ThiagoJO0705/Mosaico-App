// src/screens/ProfileScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import MosaicGrid from '../components/MosaicGrid';
import { AreaId } from '../types/models';

const ProfileScreen: React.FC = () => {
  const { user } = useUser();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Seu perfil MOSAICO</Text>
      <Text style={styles.subtitle}>
        Cada habilidade que você conquista vira uma peça no seu mosaico.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{user.name}</Text>
        <Text style={styles.cardText}>Nível {user.level}</Text>
        <Text style={styles.cardText}>{user.xp} XP acumulados</Text>
        <Text style={styles.cardText}>🔥 Streak: {user.streak} dias seguidos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Seu MOSAICO de habilidades</Text>
        <Text style={styles.cardText}>Peças totais: {user.pieces}</Text>

        <View style={{ marginTop: 12 }}>
          <MosaicGrid history={user.piecesHistory} />
        </View>

        <View style={styles.legendContainer}>
          {(['IA', 'Soft Skills', 'ESG', 'Tech'] as AreaId[]).map((area) => (
            <View key={area} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: getColorByArea(area) },
                ]}
              />
              <Text style={styles.legendText}>{area}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Badges conquistadas</Text>
        {user.badges.length === 0 ? (
          <Text style={styles.cardText}>
            Você ainda não tem badges. Bora começar uma trilha! 🚀
          </Text>
        ) : (
          user.badges.map((badge) => (
            <Text key={badge} style={styles.badgeItem}>
              • {translateBadge(badge)}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const getColorByArea = (area: AreaId): string => {
  switch (area) {
    case 'IA':
      return '#0EA5E9';
    case 'Soft Skills':
      return '#22C55E';
    case 'ESG':
      return '#A855F7';
    case 'Tech':
      return '#F97316';
    default:
      return '#CBD5F5';
  }
};

const translateBadge = (badgeId: string): string => {
  switch (badgeId) {
    case 'first_trail':
      return 'Primeira trilha concluída';
    case 'streak_3':
      return '3 dias seguidos estudando';
    case 'pieces_10':
      return '10 peças conquistadas';
    case 'pieces_50':
      return '50 peças conquistadas';
    default:
      return badgeId;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F1F5F9',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#0F172A',
  },
  badgeItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  legendContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#475569',
  },
});

export default ProfileScreen;
