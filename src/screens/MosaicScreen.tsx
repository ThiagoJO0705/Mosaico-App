// src/screens/MosaicScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator, 
} from "react-native";
import { useUser } from "../context/UserContext";
import MosaicRenderer from "../components/MosaicRenderer";
import { MOSAICO_SEGMENTS, MosaicIndex } from "../utils/mosaicConfig";

const COLOR_TO_SKILL_LABEL: Record<string, string> = {
  "#4DB6AC": "Tecnologia",
  "#D1C4E9": "Soft Skills",
  "#FFD54F": "ESG",
  "#A3E6D5": "Dados",
  "#90CAF9": "Liderança",
  "#FFAB91": "Produtividade",
  "#EC407A": "Marketing & Vendas",
  "#66BB6A": "Finanças & Investimentos",
  "#7E57C2": "Design & UX",
  "#FFA726": "Inovação & Empreendedorismo",
};

type MosaicBadge = {
  id: MosaicIndex;
  history: string[];
  completedAt: string;
};

const MosaicScreen: React.FC = () => {
  const { user } = useUser();


  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }


  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces ?? 0;
  const currentHistory = user.currentMosaicHistory ?? [];
  const totalSegmentsCurrent =
    currentIndex != null ? MOSAICO_SEGMENTS[currentIndex] ?? 0 : 0;

  const mosaicBadges = (user.mosaicBadges ?? []) as MosaicBadge[];

  const totalMosaics = Object.keys(MOSAICO_SEGMENTS).length;
  const completedMosaics = mosaicBadges.length;
  const allMosaicsCompleted = completedMosaics >= totalMosaics;

  const { colorEntries, totalPiecesFromColors, hasSkills } = useMemo(() => {
    const allColors: string[] = [...currentHistory];
    mosaicBadges.forEach((badge) => {
      if (Array.isArray(badge.history)) {
        allColors.push(...badge.history);
      }
    });

    const colorCounts: Record<string, number> = {};
    allColors.forEach((raw) => {
      const key = raw.trim().toUpperCase();
      if (key) {
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
    });

    const entries = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);
    return {
      colorEntries: entries,
      totalPiecesFromColors: total,
      hasSkills: total > 0,
    };
  }, [currentHistory, mosaicBadges]);

  const [selectedBadge, setSelectedBadge] = useState<MosaicBadge | null>(null);

  const { selectedColorEntries, selectedPiecesTotal } = useMemo(() => {
    if (!selectedBadge || !Array.isArray(selectedBadge.history)) {
      return { selectedColorEntries: [], selectedPiecesTotal: 0 };
    }
    const counts: Record<string, number> = {};
    selectedBadge.history.forEach((raw) => {
      const key = raw.trim().toUpperCase();
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return {
      selectedColorEntries: Object.entries(counts).sort((a, b) => b[1] - a[1]),
      selectedPiecesTotal: selectedBadge.history.length,
    };
  }, [selectedBadge]);

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Meu Mosaico</Text>
        <Text style={styles.subtitle}>
          Veja sua jornada visual de habilidades e conquistas.
        </Text>

        {allMosaicsCompleted ? (
          <View style={styles.currentCard}>
            <Text style={styles.cardTitle}>Você é um Mestre do Mosaico 🔰</Text>
            <Text style={styles.cardSubtitle}>
              Todos os mosaicos disponíveis foram concluídos. Continue estudando
              para manter suas habilidades afiadas!
            </Text>
            <View style={{ marginTop: 12 }}>
              <Text style={styles.masterLine}>
                Mosaicos concluídos: {completedMosaics}/{totalMosaics}
              </Text>
            </View>
          </View>
        ) : (
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
              {currentPieces}/{totalSegmentsCurrent} peças concluídas
            </Text>
            <Text style={styles.progressHint}>
              Complete todas as peças para transformar este mosaico em um badge
              permanente.
            </Text>
          </View>
        )}

        <View style={styles.skillsCard}>
          <Text style={styles.cardTitle}>Habilidades em destaque</Text>
          <Text style={styles.cardSubtitle}>
            Como suas peças se distribuem entre as áreas de atuação.
          </Text>
          {!hasSkills ? (
            <Text style={styles.emptyText}>
              Comece a estudar para ver suas estatísticas de habilidades aqui.
            </Text>
          ) : (
            <View style={styles.skillBarContainer}>
              <View style={styles.skillBarBackground}>
                {colorEntries.map(([colorHex, value]) => (
                  <View
                    key={colorHex}
                    style={{ flex: value, backgroundColor: colorHex }}
                  />
                ))}
              </View>
              <View style={styles.skillLegend}>
                {colorEntries.map(([colorHex, value]) => {
                  const label = COLOR_TO_SKILL_LABEL[colorHex] ?? "Outras";
                  const pct = Math.round((value / totalPiecesFromColors) * 100);
                  return (
                    <View key={colorHex} style={styles.skillLegendItem}>
                      <View
                        style={[
                          styles.skillLegendDot,
                          { backgroundColor: colorHex },
                        ]}
                      />
                      <Text style={styles.skillLegendText}>
                        {label} · {pct}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mosaicos concluídos</Text>
          {mosaicBadges.length === 0 ? (
            <Text style={styles.emptyText}>
              Você ainda não concluiu nenhum mosaico. ✨
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesHorizontalContent}
            >
              {mosaicBadges.map((badge) => (
                <TouchableOpacity
                  key={badge.id}
                  style={styles.badgeCardHorizontal}
                  activeOpacity={0.85}
                  onPress={() => setSelectedBadge(badge)}
                >
                  <MosaicRenderer
                    currentMosaicIndex={badge.id}
                    pieces={badge.history.length}
                    history={badge.history}
                    size={90}
                    showGlow={false}
                  />
                  <Text style={styles.badgeTitle}>Mosaico {badge.id}</Text>
                  <Text style={styles.badgeDate}>
                    Concluído em {badge.completedAt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBadge && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>
                      Mosaico {selectedBadge.id}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      Concluído em {selectedBadge.completedAt}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setSelectedBadge(null)}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalMosaicWrapper}>
                  <MosaicRenderer
                    currentMosaicIndex={selectedBadge.id}
                    pieces={selectedPiecesTotal}
                    history={selectedBadge.history}
                    size={200}
                  />
                </View>
                <Text style={styles.modalInfo}>
                  Peças concluídas:{" "}
                  <Text style={{ fontWeight: "700" }}>
                    {selectedPiecesTotal}
                  </Text>
                </Text>
                {selectedPiecesTotal > 0 && (
                  <>
                    <Text style={styles.modalSectionTitle}>
                      Habilidades neste mosaico
                    </Text>
                    <View style={styles.skillLegend}>
                      {selectedColorEntries.map(([colorHex, value]) => {
                        const label =
                          COLOR_TO_SKILL_LABEL[colorHex] ?? "Outras";
                        const pct = Math.round(
                          (value / selectedPiecesTotal) * 100
                        );
                        return (
                          <View key={colorHex} style={styles.skillLegendItem}>
                            <View
                              style={[
                                styles.skillLegendDot,
                                { backgroundColor: colorHex },
                              ]}
                            />
                            <Text style={styles.skillLegendText}>
                              {label} · {value} peça(s) · {pct}%
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
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
  title: { color: "#F5F5F5", fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#B0BEC5", fontSize: 14, marginTop: 4, marginBottom: 16 },
  currentCard: {
    backgroundColor: "#2A3B4C",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: { color: "#F5F5F5", fontSize: 18, fontWeight: "600" },
  cardSubtitle: { color: "#B0BEC5", fontSize: 13, marginTop: 4 },
  mosaicWrapper: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    marginTop: 12,
    color: "#A3E6D5",
    fontSize: 14,
    fontWeight: "500",
  },
  progressHint: { marginTop: 4, color: "#B0BEC5", fontSize: 12 },
  masterLine: { color: "#A3E6D5", fontSize: 14, fontWeight: "600" },
  masterHint: { color: "#CFD8DC", fontSize: 12, marginTop: 4 },
  skillsCard: {
    backgroundColor: "#2A3B4C",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  skillBarContainer: { marginTop: 12 },
  skillBarBackground: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "#1C2A3A",
    overflow: "hidden",
    flexDirection: "row",
  },
  skillLegend: { marginTop: 8 },
  skillLegendItem: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  skillLegendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  skillLegendText: { color: "#ECEFF1", fontSize: 12 },
  section: { marginTop: 8 },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: { color: "#B0BEC5", fontSize: 13 },
  badgesHorizontalContent: { paddingRight: 16 },
  badgeCardHorizontal: {
    width: 140,
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    marginRight: 12,
  },
  badgeTitle: {
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 6,
  },
  badgeDate: {
    color: "#B0BEC5",
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "88%",
    maxHeight: "85%",
    backgroundColor: "#2A3B4C",
    borderRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalTitle: { color: "#F5F5F5", fontSize: 18, fontWeight: "700" },
  modalSubtitle: { color: "#B0BEC5", fontSize: 12, marginTop: 2 },
  modalCloseButton: { paddingHorizontal: 8, paddingVertical: 4 },
  modalCloseText: { color: "#F5F5F5", fontSize: 18, fontWeight: "700" },
  modalMosaicWrapper: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalInfo: { marginTop: 12, color: "#A3E6D5", fontSize: 14 },
  modalSectionTitle: {
    marginTop: 10,
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MosaicScreen;
