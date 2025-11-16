// src/screens/MosaicScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import MosaicRenderer from '../components/MosaicRenderer';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';

const MosaicScreen: React.FC = () => {
  const { user } = useUser();

  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces;
  const currentHistory = user.currentMosaicHistory;
  const totalSegments = MOSAICO_SEGMENTS[currentIndex];

  const mosaicBadges = user.mosaicBadges;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meu Mosaico</Text>
      <Text style={styles.subtitle}>
        Veja sua jornada visual de habilidades e conquistas.
      </Text>

      <View style={styles.currentCard}>
        <Text style={styles.cardTitle}>Mosaico {currentIndex}</Text>
        <Text style={styles.cardSubtitle}>
          Capítulo atual da sua trajetória.
        </Text>

        <View style={styles.mosaicWrapper}>
          <MosaicRenderer
            currentMosaicIndex={currentIndex}
            pieces={currentPieces}
            history={currentHistory}
            size={260}
          />
        </View>

        <Text style={styles.progressText}>
          {currentPieces}/{totalSegments} peças concluídas
        </Text>
        <Text style={styles.progressHint}>
          Complete todas as peças para transformar este mosaico em um badge permanente.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mosaicos concluídos</Text>

        {mosaicBadges.length === 0 && (
          <Text style={styles.emptyText}>
            Você ainda não concluiu nenhum mosaico. Continue estudando para
            desbloquear o primeiro! ✨
          </Text>
        )}

        {mosaicBadges.length > 0 && (
  <View style={styles.badgesGrid}>
    {mosaicBadges.map((badge) => (
      <View key={badge.id} style={styles.badgeCard}>
        <MosaicRenderer
          currentMosaicIndex={badge.id}
          pieces={badge.history.length}
          history={badge.history}
          size={100}
        />
        <Text style={styles.badgeTitle}>Mosaico {badge.id}</Text>
        <Text style={styles.badgeDate}>
          Concluído em {badge.completedAt}
        </Text>
      </View>
    ))}
  </View>
)}

      </View>

      <View style={{ height: 40 }} />
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
  title: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  currentCard: {
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
  mosaicWrapper: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    marginTop: 12,
    color: '#A3E6D5',
    fontSize: 14,
    fontWeight: '500',
  },
  progressHint: {
    marginTop: 4,
    color: '#B0BEC5',
    fontSize: 12,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: 130,
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  badgeTitle: {
    color: '#F5F5F5',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
  },
  badgeDate: {
    color: '#B0BEC5',
    fontSize: 11,
    marginTop: 2,
  },
});

export default MosaicScreen;
