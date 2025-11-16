// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { TRACKS } from '../data/tracks';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser();

  const tracksData = Array.isArray(TRACKS) ? TRACKS : [];

  const dailyMissions = [
    { id: 'm1', title: 'Concluir uma aula de qualquer trilha' },
    { id: 'm2', title: 'Estudar 15 minutos hoje' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Topo: saudação + badge de nível */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.name}! 👋</Text>
          <Text style={styles.subtitle}>
            O futuro do trabalho se constrói peça por peça.
          </Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>Nível</Text>
          <Text style={styles.levelValue}>{user.level}</Text>
          <Text style={styles.levelTag}>Construtor 💎</Text>
        </View>
      </View>

      {/* Barra de XP fina */}
      <View style={styles.xpContainer}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>XP para o próximo nível</Text>
          <Text style={styles.xpValue}>{user.xp} XP</Text>
        </View>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarFill, { width: `${user.progress}%` }]} />
        </View>
      </View>

      {/* Streak + atalho para perfil/mosaico */}
      <View style={styles.row}>
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>
              {user.streakDays} dias de jornada
            </Text>
            <Text style={styles.streakSubtitle}>
              Continue vindo todo dia para manter o ritmo.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileShortcut}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileShortcutTitle}>Ver meu MOSAICO</Text>
          <Text style={styles.profileShortcutSubtitle}>
            Acompanhe sua evolução visual
          </Text>
        </TouchableOpacity>
      </View>

      {/* Missões do dia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Missões do dia</Text>
        {dailyMissions.map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <Text style={styles.missionText}>{mission.title}</Text>
          </View>
        ))}
      </View>

      {/* Trilhas recomendadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trilhas recomendadas</Text>

        <FlatList
          data={tracksData}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const trackProg =
              user.trackProgress[item.id]?.completedLessons ?? 0;
            const percent = Math.round(
              (trackProg / item.totalLessons) * 100
            );

            return (
              <View style={styles.trackCard}>
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.trackSubtitle}>
                  {trackProg}/{item.totalLessons} aulas (
                  {isNaN(percent) ? 0 : percent}%)
                </Text>

                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => navigation.navigate('Tracks')}
                >
                  <Text style={styles.trackButtonText}>
                    Ir para trilha
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma trilha cadastrada ainda.
            </Text>
          }
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
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
  levelBadge: {
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    paddingHorizontal: 12,
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
  levelTag: {
    color: '#D1C4E9',
    fontSize: 11,
    marginTop: 2,
  },
  xpContainer: {
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    color: '#B0BEC5',
    fontSize: 12,
  },
  xpValue: {
    color: '#A3E6D5',
    fontSize: 12,
    fontWeight: '600',
  },
  xpBarBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#3E3C30',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4DB6AC',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakIcon: {
    fontSize: 22,
  },
  streakTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
  },
  streakSubtitle: {
    color: '#B0BEC5',
    fontSize: 12,
  },
  profileShortcut: {
    flex: 1,
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
  },
  profileShortcutTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
  },
  profileShortcutSubtitle: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  missionCard: {
    backgroundColor: '#3E3C30',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  missionText: {
    color: '#F5F5F5',
    fontSize: 14,
  },
  trackCard: {
    backgroundColor: '#3E3C30',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#F5F5F5',
    fontSize: 15,
    fontWeight: '600',
  },
  trackSubtitle: {
    color: '#B0BEC5',
    fontSize: 13,
    marginTop: 4,
  },
  trackButton: {
    marginTop: 8,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4DB6AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#2C2B21',
    fontWeight: '600',
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 13,
  },
});

export default HomeScreen;
