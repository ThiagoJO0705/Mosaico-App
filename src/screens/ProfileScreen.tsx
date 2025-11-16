// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import MosaicRenderer from '../components/MosaicRenderer';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';

const ProfileScreen: React.FC = () => {
const navigation = useNavigation<any>();
  const { user } = useUser();

  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces;
  const currentHistory = user.currentMosaicHistory ?? [];
  const totalSegments = MOSAICO_SEGMENTS[currentIndex];

  const mosaicBadges = user.mosaicBadges ?? [];

  // quantidade total de mosaicos disponíveis
  const totalMosaics = Object.keys(MOSAICO_SEGMENTS).length;

  // true se o usuário já concluiu todos
  const isMosaicMaster = mosaicBadges.length >= totalMosaics;

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.name} 👋</Text>
          <Text style={styles.subtitle}>
            Cada habilidade é uma peça. Continue montando seu MOSAICO.
          </Text>
        </View>

        <View style={styles.levelPill}>
          <Text style={styles.levelLabel}>Nível</Text>
          <Text style={styles.levelValue}>{user.level}</Text>
        </View>
      </View>

      {isMosaicMaster && (
        <View style={styles.masterBanner}>
          <Text style={styles.masterTitle}>Mestre do Mosaico 🧠✨</Text>
          <Text style={styles.masterSubtitle}>
            Você concluiu todos os mosaicos principais. Seu perfil está no nível mestre.
            Continue explorando trilhas para se manter afiado.
          </Text>
        </View>
      )}

      {/* Card principal com preview do mosaico */}
      <TouchableOpacity
        style={styles.mosaicCard}
        activeOpacity={0.85}
        onPress={() => {
          const parent = navigation.getParent?.();
          if (parent) {
            parent.navigate('Mosaic');
          } else {
            navigation.navigate('Mosaic');
          }
        }}
      >
        <Text style={styles.cardTitle}>Mosaico atual</Text>
        <Text style={styles.cardSubtitle}>
          Toque para ver sua jornada completa
        </Text>

        <View style={styles.mosaicPreviewWrapper}>
          <MosaicRenderer
            currentMosaicIndex={currentIndex}
            pieces={currentPieces}
            history={currentHistory}
            size={180}
          />
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {currentPieces}/{totalSegments} peças concluídas
          </Text>
          <Text style={styles.progressHint}>ver detalhes ⟶</Text>
        </View>

        <View style={styles.streakRow}>
          <View style={styles.streakPill}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>
              {user.streakDays} dias de jornada
            </Text>
          </View>

          <View style={styles.xpPill}>
            <Text style={styles.xpLabel}>XP</Text>
            <Text style={styles.xpValue}>{user.xp}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Seção: progresso geral */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seu progresso</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Trilhas ativas</Text>
            <Text style={styles.statValue}>{user.activeTracksCount}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Aulas concluídas</Text>
            <Text style={styles.statValue}>{user.lessonsCompleted}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Áreas exploradas</Text>
            <Text style={styles.statValue}>{user.areasExplored}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Progresso geral</Text>
            <Text style={styles.statValue}>{user.progress}%</Text>
          </View>
        </View>
      </View>

      {/* Seção: mosaicos concluídos */}
      {mosaicBadges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mosaicos concluídos</Text>

          <View style={styles.badgesRow}>
            {mosaicBadges.map((badge) => {
              const badgeHistory = Array.isArray(badge.history)
                ? badge.history
                : [];
              const piecesCount = badgeHistory.length;

              return (
                <View style={styles.badgeItem} key={badge.id}>
                  <MosaicRenderer
                    currentMosaicIndex={badge.id}
                    pieces={piecesCount}
                    history={badgeHistory}
                    size={80}
                  />
                  <Text style={styles.badgeLabel}>Mosaico {badge.id}</Text>
                  <Text style={styles.badgeDate}>{badge.completedAt}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2B21',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 4,
  },
  levelPill: {
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  levelLabel: {
    color: '#B0BEC5',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  levelValue: {
    color: '#A3E6D5',
    fontSize: 18,
    fontWeight: '700',
  },

  /* novo card de mestre */
  masterCard: {
    backgroundColor: '#454331',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6D98A55',
  },
  masterText: {
    color: '#E0E0E0',
    fontSize: 13,
    marginTop: 4,
  },

  mosaicCard: {
    backgroundColor: '#3E3C30',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#B0BEC5',
    fontSize: 13,
    marginTop: 4,
  },
  mosaicPreviewWrapper: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressText: {
    color: '#A3E6D5',
    fontSize: 14,
    fontWeight: '500',
  },
  progressHint: {
    color: '#D1C4E9',
    fontSize: 12,
  },
  streakRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2B21',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  streakText: {
    color: '#F5F5F5',
    fontSize: 13,
  },
  xpPill: {
    backgroundColor: '#4DB6AC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpLabel: {
    color: '#2C2B21',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4,
  },
  xpValue: {
    color: '#2C2B21',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statLabel: {
    color: '#B0BEC5',
    fontSize: 12,
  },
  statValue: {
    color: '#A3E6D5',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: 110,
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
  },
  badgeLabel: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  badgeDate: {
    color: '#B0BEC5',
    fontSize: 10,
    marginTop: 2,
  },

    masterBanner: {
    backgroundColor: '#4DB6AC22',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4DB6AC55',
  },
  masterTitle: {
    color: '#A3E6D5',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  masterSubtitle: {
    color: '#E0E0E0',
    fontSize: 13,
  },
});

export default ProfileScreen;
