// src/screens/ProfileScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { MOSAICO_SEGMENTS, MosaicIndex } from "../utils/mosaicConfig";
import { colors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useUser() as any;

  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces;
  const currentHistory = user.currentMosaicHistory ?? [];
  const totalSegmentsCurrent = MOSAICO_SEGMENTS[currentIndex];

  const mosaicBadges = user.mosaicBadges ?? [];
  const totalMosaics = Object.keys(MOSAICO_SEGMENTS).length;
  const allCompleted = mosaicBadges.length >= totalMosaics;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Olá, {user.name} 👋</Text>
          <Text style={styles.subtitle}>
            Cada habilidade é uma peça. Continue montando seu MOSAICO.
          </Text>
        </View>

        {/* Lado direito: botões de ação */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color="#F5F5F5" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="log-out-outline" size={22} color="#F5F5F5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card principal - resumo do mosaico */}
      <TouchableOpacity
        style={styles.mosaicCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Mosaic")}
      >
        {allCompleted ? (
          <>
            <Text style={styles.cardTitle}>Mosaico completo</Text>
            <Text style={styles.cardSubtitle}>
              Você concluiu todos os mosaicos disponíveis. 🎉
            </Text>

            <Text style={styles.mosaicSummaryHighlight}>
              {mosaicBadges.length} de {totalMosaics} mosaicos concluídos.
            </Text>

            <Text style={styles.mosaicSummaryText}>
              Parabéns! Você se tornou um verdadeiro{" "}
              <Text style={styles.bold}>Mestre do Mosaico</Text>.
            </Text>

            <Text style={styles.cardLink}>ver conquistas →</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Seu mosaico</Text>
            <Text style={styles.cardSubtitle}>
              Resumo da sua progressão atual.
            </Text>

            <View style={styles.mosaicInfoRow}>
              <View style={styles.mosaicInfoBlock}>
                <Text style={styles.infoLabel}>Mosaico atual</Text>
                <Text style={styles.infoValue}>#{currentIndex}</Text>
              </View>

              <View style={styles.mosaicInfoBlock}>
                <Text style={styles.infoLabel}>Peças concluídas</Text>
                <Text style={styles.infoValue}>
                  {currentPieces}/{totalSegmentsCurrent}
                </Text>
              </View>
            </View>

            <View style={styles.mosaicInfoRow}>
              <View style={styles.mosaicInfoBlock}>
                <Text style={styles.infoLabel}>Mosaicos concluídos</Text>
                <Text style={styles.infoValue}>
                  {mosaicBadges.length}/{totalMosaics}
                </Text>
              </View>
            </View>

            <Text style={styles.cardLink}>ver mosaico em detalhes →</Text>
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
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
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
  levelRow: {
    marginTop: 10,
    flexDirection: "row",
  },
  levelPill: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(163,230,213,0.4)", // secondary suave
  },
  levelLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    textTransform: "uppercase",
  },
  levelValue: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "700",
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
  logoutButton: {
    backgroundColor: "#C62828",
  },
  iconButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
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
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
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
});

export default ProfileScreen;
