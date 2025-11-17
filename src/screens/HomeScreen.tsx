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
import { colors } from '../styles/colors';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser() as any;

  const tracksData = Array.isArray(TRACKS) ? TRACKS : [];

  const dailyMissions = [
    { id: 'm1', title: 'Concluir uma aula de qualquer trilha' },
    { id: 'm2', title: 'Estudar 15 minutos hoje' },
  ];

  const recommendedTracks = tracksData.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Topo: saudação + badge de nível */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Olá, {user.name}! 👋</Text>
          <Text style={styles.subtitle}>
            O futuro do trabalho se constrói peça por peça.
          </Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>NÍVEL</Text>
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
          <View
            style={[
              styles.xpBarFill,
              { width: `${Math.min(100, Math.max(0, user.progress))}%` },
            ]}
          />
        </View>
      </View>

      {/* Streak + atalho para perfil/mosaico */}
      <View style={styles.row}>
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={{ flex: 1 }}>
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
          onPress={() => navigation.navigate('Perfil')}
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
          data={recommendedTracks}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const trackProg =
              user.trackProgress?.[item.id]?.completedLessons ?? 0;
            const percent = Math.round(
              (trackProg / item.totalLessons) * 100,
            );
            const safePercent = isNaN(percent) ? 0 : percent;

            return (
              <View style={styles.trackCard}>
                <Text style={styles.trackTitle}>{item.title}</Text>

                <View style={styles.trackProgressRow}>
                  <Text style={styles.trackProgressLabel}>
                    {trackProg}/{item.totalLessons} aulas
                  </Text>
                  <Text style={styles.trackProgressPercent}>
                    {safePercent}%
                  </Text>
                </View>

                <View style={styles.trackProgressBarBackground}>
                  <View
                    style={[
                      styles.trackProgressBarFill,
                      {
                        width: `${Math.min(
                          100,
                          Math.max(0, safePercent),
                        )}%`,
                      },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => navigation.navigate('Trilhas')}
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

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 72,
  },
  levelLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelValue: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  levelTag: {
    color: colors.accent,
    fontSize: 10,
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
    color: colors.textSecondary,
    fontSize: 12,
  },
  xpValue: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  xpBarBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#223347',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  streakCard: {
    flex: 1,
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  streakSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  profileShortcut: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
  },
  profileShortcutTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  profileShortcutSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  missionCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  missionText: {
    color: colors.textPrimary,
    fontSize: 14,
  },

  trackCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  trackTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  trackProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  trackProgressLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  trackProgressPercent: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  trackProgressBarBackground: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#223347',
    overflow: 'hidden',
    marginBottom: 8,
  },
  trackProgressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  trackButton: {
    marginTop: 4,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});

export default HomeScreen;
