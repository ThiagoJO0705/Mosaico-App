// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { TRACKS, Track } from "../data/tracks";
import MissionsModal, {
  Mission as MissionType,
} from "../components/MissionsModal";
// MODIFICAÇÃO: Importa a função de cálculo de XP
import { calculateLevelProgress } from "../utils/xpConfig";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser();

  const [missionsModalVisible, setMissionsModalVisible] = useState(false);

  // MODIFICAÇÃO: Calcula todas as informações de nível e progresso em uma única chamada
  const levelInfo = calculateLevelProgress(user.xp);

  const allTracks = Array.isArray(TRACKS) ? TRACKS : [];

  const recommendedIds = user.recommendedTrackIds ?? [];
  const recommendedTracks: Track[] =
    recommendedIds.length > 0
      ? allTracks.filter((t) => recommendedIds.includes(t.id))
      : allTracks.slice(0, 3);

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

          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelLabel}>NÍVEL</Text>
            {/* MODIFICAÇÃO: Usa o nível calculado */}
            <Text style={styles.levelValue}>{levelInfo.currentLevel}</Text>
            {/* MODIFICAÇÃO: Usa o título de nível calculado */}
            <Text style={styles.levelTag}>{levelInfo.levelTitle} 💎</Text>
          </View>
        </View>

        {/* XP */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP para o próximo nível</Text>
            {/* MODIFICAÇÃO: Exibe o progresso do nível atual */}
            <Text style={styles.xpValue}>
              {levelInfo.xpEarnedInCurrentLevel} /{" "}
              {levelInfo.xpNeededForNextLevel} XP
            </Text>
          </View>
          <View style={styles.xpBarBackground}>
            {/* MODIFICAÇÃO: Usa a nova porcentagem para a largura da barra */}
            <View
              style={[
                styles.xpBarFill,
                { width: `${levelInfo.progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        {/* Streak + Mosaico */}
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
            onPress={() => navigation.navigate("Mosaico")} // Navega para a tela de Mosaico
          >
            <Text style={styles.profileShortcutTitle}>Ver meu MOSAICO</Text>
            <Text style={styles.profileShortcutSubtitle}>
              Acompanhe sua evolução visual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Missões */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Missões do dia</Text>
            <TouchableOpacity onPress={() => setMissionsModalVisible(true)}>
              <Text style={styles.sectionLink}>ver todas →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.missionsOuter}>
            {dailyMissions.map((mission) => (
              <View key={mission.id} style={styles.missionCard}>
                <View style={styles.missionAccentBar} />
                <View style={styles.missionContent}>
                  <Text style={styles.missionText}>{mission.title}</Text>
                </View>
                <View style={styles.missionRewardPill}>
                  <View style={styles.rewardRow}>
                    <Text style={styles.rewardEmoji}>✨</Text>
                    <Text style={styles.rewardValue}>
                      +{mission.rewardPieces}
                    </Text>
                  </View>
                  <View style={styles.rewardRow}>
                    <Text style={styles.rewardEmoji}>⚡</Text>
                    <Text style={styles.rewardValue}>+{mission.rewardXp}</Text>
                  </View>
                </View>
              </View>
            ))}
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
                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate("Trilhas")}
                  >
                    <Text style={styles.trackButtonText}>Ir para trilha</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL DE MISSÕES */}
      <MissionsModal
        visible={missionsModalVisible}
        onClose={() => setMissionsModalVisible(false)}
        dailyMissions={dailyMissions}
        weeklyMissions={weeklyMissions}
      />
    </>
  );
};

// ... (seus estilos permanecem os mesmos)

const styles = StyleSheet.create({
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
  xpContainer: { marginBottom: 16 },
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
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  streakCard: {
    flex: 1,
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  streakIcon: { fontSize: 22 },
  streakTitle: { color: "#F5F5F5", fontSize: 14, fontWeight: "600" },
  streakSubtitle: { color: "#B0BEC5", fontSize: 12 },
  profileShortcut: {
    flex: 1,
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    padding: 12,
    justifyContent: "center",
  },
  profileShortcutTitle: { color: "#F5F5F5", fontSize: 14, fontWeight: "600" },
  profileShortcutSubtitle: { color: "#B0BEC5", fontSize: 12, marginTop: 2 },
  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: "#F5F5F5", fontSize: 16, fontWeight: "600" },
  sectionLink: { color: "#A3E6D5", fontSize: 12 },
  missionsOuter: {
    backgroundColor: "#234154",
    borderRadius: 20,
    padding: 10,
    gap: 8,
    marginTop: 6,
  },
  missionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2A3A",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  missionAccentBar: {
    width: 4,
    height: "80%",
    backgroundColor: "#D1C4E9",
    borderRadius: 999,
    marginRight: 10,
  },
  missionContent: { flex: 1 },
  missionText: { color: "#F5F5F5", fontSize: 14 },
  missionRewardPill: {
    backgroundColor: "#2A3B4C",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rewardEmoji: { fontSize: 12 },
  rewardValue: { color: "#F5F5F5", fontSize: 12, fontWeight: "600" },
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
    marginTop: 8,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#4DB6AC",
    justifyContent: "center",
    alignItems: "center",
  },
  trackButtonText: { color: "#1C2A3A", fontWeight: "600" },
});

export default HomeScreen;
