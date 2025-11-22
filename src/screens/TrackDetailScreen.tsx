// src/screens/TrackDetailScreen.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator, 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TRACKS } from '../data/tracks';
import { useUser } from '../context/UserContext';
import type { RootStackParamList } from '../navigation/RootNavigator';

type TrackDetailRouteProp = RouteProp<RootStackParamList, 'TrackDetail'>;

const TrackDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<TrackDetailRouteProp>();
  const { trackId } = route.params;

  const { user, completeLesson } = useUser();

  const track = useMemo(
    () => TRACKS.find((t) => t.id === trackId),
    [trackId],
  );


  if (!user || !track) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        {!track ? (
          <Text style={styles.errorText}>
            Trilha não encontrada. Tente voltar e selecionar novamente.
          </Text>
        ) : (
          <ActivityIndicator size="large" color="#4DB6AC" />
        )}
      </View>
    );
  }


  const trackProg = user.trackProgress[track.id]?.completedLessons ?? 0;
  const percent = Math.round((trackProg / track.totalLessons) * 100);
  const clampedPercent = isNaN(percent) ? 0 : percent;
  const isCompleted = trackProg >= track.totalLessons;

  const handleStartOrContinue = () => {
    if (!isCompleted) {

      completeLesson(track.id);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>⟵ Voltar para Trilhas</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.titleBlock}>
        <Text style={styles.areaText}>{track.area}</Text>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.subtitle}>{track.description}</Text>
      </View>


      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaLabel}>Dificuldade</Text>
          <Text style={styles.metaValue}>{track.difficulty}</Text>
        </View>

        <View style={styles.metaChip}>
          <Text style={styles.metaLabel}>Carga horária</Text>
          <Text style={styles.metaValue}>
            ~{Math.round(track.durationMinutes / 60)}h
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaLabel}>Aulas</Text>
          <Text style={styles.metaValue}>
            {track.totalLessons} aulas
          </Text>
        </View>

        <View style={styles.metaChip}>
          <Text style={styles.metaLabel}>Recompensas</Text>
          <Text style={styles.metaValue}>
            ✨ {track.rewardPieces} peça(s) · +{track.rewardXp} XP
          </Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Seu progresso</Text>
        <Text style={styles.progressSubtitle}>
          {trackProg}/{track.totalLessons} aulas concluídas ({clampedPercent}%)
        </Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${clampedPercent}%` },
            ]}
          />
        </View>

        <Text style={styles.progressHint}>
          Complete todas as aulas para ganhar as recompensas desta trilha.
        </Text>
      </View>


      <TouchableOpacity
        style={[
          styles.mainButton,
          isCompleted && styles.mainButtonCompleted,
        ]}
        onPress={handleStartOrContinue}
        disabled={isCompleted} 
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.mainButtonText,
            isCompleted && styles.mainButtonTextCompleted,
          ]}
        >
          {isCompleted ? 'Trilha concluída ✅' : `Concluir aula #${trackProg + 1}`}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerRow: {
    marginBottom: 12,
  },
  backText: {
    color: '#A3E6D5',
    fontSize: 14,
  },
  titleBlock: {
    marginBottom: 16,
  },
  areaText: {
    color: '#D1C4E9',
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  metaChip: {
    flex: 1,
    backgroundColor: '#2A3B4C',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaLabel: {
    color: '#B0BEC5',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  progressTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
  },
  progressSubtitle: {
    color: '#CFD8DC',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1C2A3A',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#A3E6D5',
  },
  progressHint: {
    color: '#B0BEC5',
    fontSize: 12,
  },
  mainButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4DB6AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonCompleted: {
    backgroundColor: '#2A3B4C', 
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  mainButtonText: {
    color: '#1C2A3A',
    fontSize: 15,
    fontWeight: '700',
  },
  mainButtonTextCompleted: {
    color: '#A3E6D5', 
  },
  errorText: {
    color: '#F5F5F5',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default TrackDetailScreen;