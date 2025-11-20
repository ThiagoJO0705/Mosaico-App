// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { TRACKS, Track } from "../data/tracks";
import MissionsModal, {
  Mission as MissionType,
} from "../components/MissionsModal";
import { calculateLevelProgress } from "../utils/xpConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator"; // Importa a tipagem do navegador principal

// MODIFICAÇÃO: Usa a tipagem correta para a navegação
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useUser();

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  const [missionsModalVisible, setMissionsModalVisible] = useState(false);
  const levelInfo = calculateLevelProgress(user.xp);
  const allTracks = Array.isArray(TRACKS) ? TRACKS : [];

  // A lógica de recomendação agora vem diretamente do 'user'
  const recommendedIds = user.recommendedTrackIds ?? [];
  const recommendedTracks: Track[] =
    recommendedIds.length > 0
      ? allTracks.filter((t) => recommendedIds.includes(t.id))
      : allTracks.slice(0, 3); // Fallback caso não haja recomendações

  const dailyMissions: MissionType[] = [
    {
      id: "m1",
      title: "Concluir uma aula de qualquer trilha",
      rewardPieces: 1,
      rewardXp: 10,
      completed: false,
    },
    {
      id: "m2",
      title: "Estudar por 15 minutos hoje",
      rewardPieces: 1,
      rewardXp: 15,
      completed: false,
    },
  ];
  const weeklyMissions: MissionType[] = [
    {
      id: "w1",
      title: "Concluir 5 aulas nesta semana",
      rewardPieces: 2,
      rewardXp: 40,
      completed: false,
    },
    {
      id: "w2",
      title: "Estudar em 4 dias diferentes",
      rewardPieces: 2,
      rewardXp: 50,
      completed: true,
    },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Topo */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Olá, {user.name}! 👋</Text>
            <Text style={styles.subtitle}>
              O futuro do trabalho se constrói peça por peça.
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelLabel}>NÍVEL</Text>
            <Text style={styles.levelValue}>{levelInfo.currentLevel}</Text>
            <Text style={styles.levelTag}>{levelInfo.levelTitle}</Text>
          </View>
        </View>

        {/* XP */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP para o próximo nível</Text>
            <Text style={styles.xpValue}>
              {levelInfo.xpEarnedInCurrentLevel} /{" "}
              {levelInfo.xpNeededForNextLevel} XP
            </Text>
          </View>
          <View style={styles.xpBarBackground}>
            <View
              style={[
                styles.xpBarFill,
                { width: `${levelInfo.progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        {/* Card de Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakTitle}>
            {user.streakDays} DIAS DE JORNADA
          </Text>
          <Text style={styles.streakSubtitle}>
            Continue vindo todo dia para manter o ritmo.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileShortcut}
          onPress={() => navigation.navigate("Mosaic")}
        >
          <Text style={styles.profileShortcutTitle}>Ver meu MOSAICO</Text>
          <Text style={styles.profileShortcutSubtitle}>
            Acompanhe sua evolução visual
          </Text>
        </TouchableOpacity>

        {/* Missões */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Missões do dia</Text>
            <TouchableOpacity onPress={() => setMissionsModalVisible(true)}>
              <Text style={styles.sectionLink}>ver todas →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.missionsContainer}>
            {dailyMissions.slice(0, 2).map((mission) => {
              const isCompleted = mission.completed;
              return (
                <View
                  key={mission.id}
                  style={[
                    styles.missionCard,
                    isCompleted && styles.missionCardCompleted,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.missionCheckbox,
                      isCompleted && styles.missionCheckboxCompleted,
                    ]}
                  >
                    {isCompleted && <Text style={styles.missionCheck}>✓</Text>}
                  </TouchableOpacity>
                  <View style={styles.missionContent}>
                    <Text style={styles.missionText}>{mission.title}</Text>
                    <Text style={styles.missionRewardText}>
                      ✨ +{mission.rewardPieces} Peça | ⚡ +{mission.rewardXp}{" "}
                      XP
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
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
                user.trackProgress[item.id]?.completedLessons ?? 0;
              const percent = Math.round((trackProg / item.totalLessons) * 100);
              return (
                <View style={styles.trackCard}>
                  <View style={styles.trackHeaderRow}>
                    <View style={styles.trackTag}>
                      <Text style={styles.trackTagText}>{item.area}</Text>
                    </View>
                    <Text style={styles.trackDifficulty}>
                      {item.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <Text style={styles.trackDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.trackProgressText}>
                    {trackProg}/{item.totalLessons} aulas (
                    {isNaN(percent) ? 0 : percent}%)
                  </Text>

                  {/* MODIFICAÇÃO PRINCIPAL: Botão agora navega para a tela de detalhes */}
                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() =>
                      navigation.navigate("TrackDetail", { trackId: item.id })
                    }
                  >
                    <Text style={styles.trackButtonText}>Ir para trilha</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhuma trilha recomendada para você no momento. Explore todas
                as trilhas na aba "Trilhas".
              </Text>
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <MissionsModal
        visible={missionsModalVisible}
        onClose={() => setMissionsModalVisible(false)}
        dailyMissions={dailyMissions}
        weeklyMissions={weeklyMissions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C2A3A",
  },
  container: {
    flex: 1,
    backgroundColor: "#1C2A3A",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: { color: "#F5F5F5", fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#B0BEC5", fontSize: 14, marginTop: 4 },
  levelBadge: {
    backgroundColor: "#2A3B4C",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 82,
  },
  levelLabel: { color: "#B0BEC5", fontSize: 10 },
  levelValue: { color: "#A3E6D5", fontSize: 18, fontWeight: "700" },
  levelTag: { color: "#D1C4E9", fontSize: 11, marginTop: 2 },
  xpContainer: { marginBottom: 20 },
  xpHeader: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { color: "#B0BEC5", fontSize: 12 },
  xpValue: { color: "#A3E6D5", fontSize: 12, fontWeight: "600" },
  xpBarBackground: {
    height: 8,
    backgroundColor: "#2A3B4C",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 4,
  },
  xpBarFill: { height: 8, backgroundColor: "#4DB6AC", borderRadius: 999 },
  streakCard: {
    backgroundColor: "#2A3B4C",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 213, 79, 0.3)",
  },
  streakIcon: {
    fontSize: 28,
  },
  streakTitle: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  streakSubtitle: {
    color: "#B0BEC5",
    fontSize: 13,
    marginTop: 2,
    textAlign: "center",
  },
  profileShortcut: {
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  profileShortcutTitle: { color: "#F5F5F5", fontSize: 15, fontWeight: "600" },
  profileShortcutSubtitle: { color: "#B0BEC5", fontSize: 12, marginTop: 2 },
  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: "#F5F5F5", fontSize: 16, fontWeight: "600" },
  sectionLink: { color: "#A3E6D5", fontSize: 12 },
  missionsContainer: {
    gap: 10,
    marginTop: 10,
  },
  missionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    padding: 12,
  },
  missionCardCompleted: {
    opacity: 0.6,
  },
  missionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4DB6AC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  missionCheckboxCompleted: {
    backgroundColor: "#4DB6AC",
    borderColor: "#4DB6AC",
  },
  missionCheck: {
    color: "#1C2A3A",
    fontSize: 14,
    fontWeight: "bold",
  },
  missionContent: {
    flex: 1,
  },
  missionText: {
    color: "#F5F5F5",
    fontSize: 14,
  },
  missionRewardText: {
    color: "#A3E6D5",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  trackCard: {
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  trackHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  trackTag: {
    backgroundColor: "#1C2A3A",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trackTagText: { color: "#A3E6D5", fontSize: 11, fontWeight: "600" },
  trackDifficulty: { color: "#D1C4E9", fontSize: 11 },
  trackTitle: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  trackDescription: { color: "#B0BEC5", fontSize: 13, marginTop: 4 },
  trackProgressText: { color: "#A3E6D5", fontSize: 12, marginTop: 6 },
  trackButton: {
    marginTop: 12,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#4DB6AC",
    justifyContent: "center",
    alignItems: "center",
  },
  trackButtonText: { color: "#1C2A3A", fontWeight: "600" },
  emptyText: {
    color: "#B0BEC5",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});

export default HomeScreen;
