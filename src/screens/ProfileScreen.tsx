// src/screens/ProfileScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { MOSAICO_SEGMENTS, MosaicIndex } from "../utils/mosaicConfig";
import { colors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { TRACKS } from "../data/tracks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useUser();


  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }


  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces;
  const totalSegmentsCurrent = MOSAICO_SEGMENTS[currentIndex];
  const mosaicBadges = user.mosaicBadges ?? [];
  const totalMosaics = Object.keys(MOSAICO_SEGMENTS).length;
  const allCompleted = mosaicBadges.length >= totalMosaics;
  const userInterests = user.interests ?? [];

  const userStats = useMemo(() => {
    const trackProgressEntries = Object.entries(user.trackProgress);

    const activeTracksCount = trackProgressEntries.filter(([trackId, progress]) => {
      const track = TRACKS.find(t => t.id === trackId);
      return track && progress.completedLessons < track.totalLessons;
    }).length;

    const lessonsCompleted = trackProgressEntries.reduce(
      (sum, [, progress]) => sum + progress.completedLessons,
      0
    );

    const exploredAreas = new Set<string>();
    trackProgressEntries.forEach(([trackId]) => {
      const track = TRACKS.find(t => t.id === trackId);
      if (track) {
        exploredAreas.add(track.area);
      }
    });
    const areasExplored = exploredAreas.size;

    const totalLessonsInApp = TRACKS.reduce((sum, track) => sum + track.totalLessons, 0);
    const progress = totalLessonsInApp > 0 ? Math.round((lessonsCompleted / totalLessonsInApp) * 100) : 0;
    
    return {
      activeTracksCount,
      lessonsCompleted,
      areasExplored,
      progress,
    };
  }, [user.trackProgress]);

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Você tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout }
      ]
    );
  };
  
  const handleEditInterests = () => {
    navigation.navigate("Interests", { editMode: true });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Olá, {user.name} 👋</Text>
          <Text style={styles.subtitle}>
            Cada habilidade é uma peça. Continue montando seu MOSAICO.
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color="#F5F5F5" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#F5F5F5" />
          </TouchableOpacity>
        </View>
      </View>


      <TouchableOpacity
        style={styles.mosaicCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Mosaic")}
      >
        {allCompleted ? (
          <>
            <Text style={styles.cardTitle}>Mosaico completo 🎉</Text>
            <Text style={styles.cardSubtitle}>Você concluiu todos os mosaicos disponíveis.</Text>
            <Text style={styles.mosaicSummaryHighlight}>{mosaicBadges.length} de {totalMosaics} mosaicos concluídos.</Text>
            <Text style={styles.mosaicSummaryText}>Parabéns! Você se tornou um verdadeiro <Text style={styles.bold}>Mestre do Mosaico</Text>.</Text>
            <Text style={styles.cardLink}>ver conquistas →</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Seu mosaico</Text>
            <Text style={styles.cardSubtitle}>Resumo da sua progressão atual.</Text>
            <View style={styles.mosaicInfoRow}>
              <View style={styles.mosaicInfoBlock}><Text style={styles.infoLabel}>Mosaico atual</Text><Text style={styles.infoValue}>#{currentIndex}</Text></View>
              <View style={styles.mosaicInfoBlock}><Text style={styles.infoLabel}>Peças concluídas</Text><Text style={styles.infoValue}>{currentPieces}/{totalSegmentsCurrent}</Text></View>
            </View>
            <View style={styles.mosaicInfoRow}>
              <View style={styles.mosaicInfoBlock}><Text style={styles.infoLabel}>Mosaicos concluídos</Text><Text style={styles.infoValue}>{mosaicBadges.length}/{totalMosaics}</Text></View>
            </View>
            <Text style={styles.cardLink}>ver mosaico em detalhes →</Text>
          </>
        )}
      </TouchableOpacity>
      

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas áreas de interesse</Text>
          <TouchableOpacity onPress={handleEditInterests}>
            <Text style={styles.editLink}>Editar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.interestsCard}>
          {userInterests.length > 0 ? (
            <View style={styles.chipsContainer}>
              {userInterests.map((interest) => (
                <View key={interest} style={styles.interestChip}>
                  <Text style={styles.interestChipText}>{interest}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Você ainda não definiu seus interesses. Toque em "Editar" para começar.
            </Text>
          )}
        </View>
      </View>
      

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seu progresso</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statLabel}>Trilhas ativas</Text><Text style={styles.statValue}>{userStats.activeTracksCount}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Aulas concluídas</Text><Text style={styles.statValue}>{userStats.lessonsCompleted}</Text></View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statLabel}>Áreas exploradas</Text><Text style={styles.statValue}>{userStats.areasExplored}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Progresso geral</Text><Text style={styles.statValue}>{userStats.progress}%</Text></View>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  mosaicCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  mosaicInfoRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  mosaicInfoBlock: {
    flex: 1,
    paddingVertical: 6,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  cardLink: {
    marginTop: 14,
    color: colors.accent,
    fontSize: 13,
    fontWeight: "500",
  },
  mosaicSummaryHighlight: {
    marginTop: 10,
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "700",
  },
  mosaicSummaryText: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
  },
  bold: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statValue: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editLink: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  interestsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  interestChipText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;