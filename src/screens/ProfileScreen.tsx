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
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser();

  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces ?? 0;
  const mosaicBadges = user.mosaicBadges ?? [];

  const totalMosaics = Object.keys(MOSAICO_SEGMENTS).length;
  const completedMosaics = mosaicBadges.length;
  const allMosaicsCompleted = completedMosaics >= totalMosaics;

  const totalSegmentsCurrent =
    currentIndex != null ? MOSAICO_SEGMENTS[currentIndex] ?? 0 : 0;
  const remainingPieces =
    totalSegmentsCurrent > 0
      ? Math.max(totalSegmentsCurrent - currentPieces, 0)
      : 0;

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

      {/* Card principal com RESUMO do mosaico */}
      <TouchableOpacity
        style={styles.mosaicCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Mosaic')}
      >
        {!allMosaicsCompleted ? (
          <>
            <Text style={styles.cardTitle}>Seu mosaico</Text>
            <Text style={styles.cardSubtitle}>
              Toque para ver a jornada visual completa.
            </Text>

            <View style={styles.mosaicSummaryContent}>
              <Text style={styles.mosaicSummaryLine}>
                Mosaico {currentIndex} de {totalMosaics}
              </Text>
              <Text style={styles.mosaicSummaryLine}>
                {currentPieces}/{totalSegmentsCurrent} peças concluídas
              </Text>
              <Text style={styles.mosaicSummaryHint}>
                Faltam{' '}
                <Text style={{ fontWeight: '700' }}>
                  {remainingPieces}
                </Text>{' '}
                peças para concluir este mosaico.
              </Text>
            </View>

            <View style={styles.mosaicFooterRow}>
              <Text style={styles.progressHint}>ver detalhes ⟶</Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Mosaico completo</Text>
            <Text style={styles.cardSubtitle}>
              Você concluiu todos os mosaicos disponíveis. 🎉
            </Text>

            <View style={styles.mosaicSummaryContent}>
              <Text style={styles.mosaicSummaryLine}>
                {completedMosaics} de {totalMosaics} mosaicos concluídos.
              </Text>
              <Text style={styles.mosaicSummaryHint}>
                Parabéns! Você se tornou um verdadeiro{' '}
                <Text style={{ fontWeight: '700' }}>Mestre do Mosaico</Text>.
              </Text>
            </View>

            <View style={styles.mosaicFooterRow}>
              <Text style={styles.progressHint}>ver conquistas ⟶</Text>
            </View>
          </>
        )}
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

      {/* NADA de mosaicos concluídos aqui – fica só na MosaicScreen */}

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
    marginBottom: 24,
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
  mosaicSummaryContent: {
    marginTop: 12,
  },
  mosaicSummaryLine: {
    color: '#A3E6D5',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  mosaicSummaryHint: {
    color: '#CFD8DC',
    fontSize: 12,
    marginTop: 4,
  },
  mosaicFooterRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  progressHint: {
    color: '#D1C4E9',
    fontSize: 12,
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
});

export default ProfileScreen;
