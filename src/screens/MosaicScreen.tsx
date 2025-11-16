// src/screens/MosaicScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import MosaicRenderer from '../components/MosaicRenderer';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';

// Mapeia CADA COR para o NOME da habilidade que você quiser exibir
const COLOR_TO_SKILL_LABEL: Record<string, string> = {
  '#FFD54F': 'ESG',
  '#D1C4E9': 'IA',
  '#4DB6AC': 'Tech',
  // adicione mais se tiver outras cores:
  // '#FF8A65': 'Soft Skills',
  // '#BA68C8': 'Liderança',
};

const MosaicScreen: React.FC = () => {
  const { user } = useUser();

  const currentIndex = user.currentMosaicIndex as MosaicIndex;
  const currentPieces = user.currentMosaicPieces;
  const currentHistory = user.currentMosaicHistory ?? [];
  const totalSegments = MOSAICO_SEGMENTS[currentIndex];

  const mosaicBadges = user.mosaicBadges ?? [];

  // ====== CÁLCULO DINÂMICO PELA COR DAS PEÇAS ======

  // Junta TODAS as cores usadas nas peças:
  const allColors: string[] = [];

  // Mosaico atual
  if (Array.isArray(currentHistory)) {
    currentHistory.forEach((c) => {
      if (typeof c === 'string') {
        allColors.push(c);
      }
    });
  }

  // Mosaicos concluídos
  mosaicBadges.forEach((badge) => {
    const hist = Array.isArray(badge.history) ? badge.history : [];
    hist.forEach((c) => {
      if (typeof c === 'string') {
        allColors.push(c);
      }
    });
  });

  // Conta quantas vezes cada cor aparece
  const colorCounts: Record<string, number> = {};
  allColors.forEach((raw) => {
    const key = raw.trim().toUpperCase(); // normaliza hex
    if (!key) return;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  });

  const colorEntries = Object.entries(colorCounts).sort(
    (a, b) => b[1] - a[1],
  );
  const totalPiecesFromColors =
    colorEntries.reduce((sum, [, value]) => sum + value, 0) || 0;

  const hasSkills = totalPiecesFromColors > 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Meu Mosaico</Text>
      <Text style={styles.subtitle}>
        Veja sua jornada visual de habilidades e conquistas.
      </Text>

      {/* MOSAICO ATUAL */}
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
          Complete todas as peças para transformar este mosaico em um badge
          permanente.
        </Text>
      </View>

      {/* HABILIDADES EM DESTAQUE (por cor / área) */}
      <View style={styles.skillsCard}>
        <Text style={styles.cardTitle}>Habilidades em destaque</Text>
        <Text style={styles.cardSubtitle}>
          Como suas peças se distribuem entre as áreas de atuação.
        </Text>

        {!hasSkills && (
          <Text style={styles.emptyText}>
            Assim que você começar a montar seus mosaicos, vamos mostrar aqui
            como suas habilidades se distribuem entre ESG, IA, Tech e outras áreas.
          </Text>
        )}

        {hasSkills && (
          <View style={styles.skillBarContainer}>
            {/* Barra agregada */}
            <View style={styles.skillBarBackground}>
              {colorEntries.map(([colorHex, value]) => {
                if (value <= 0) return null;
                const hex = colorHex; // já vem em maiúsculo
                return (
                  <View
                    key={hex}
                    style={[
                      styles.skillBarSegment,
                      {
                        flex: value,
                        backgroundColor: hex,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Legenda */}
            <View style={styles.skillLegend}>
              {colorEntries.map(([colorHex, value]) => {
                if (value <= 0) return null;
                const hex = colorHex;
                const label =
                  COLOR_TO_SKILL_LABEL[hex] ?? 'Outras áreas';
                const pct = Math.round(
                  (value / totalPiecesFromColors) * 100,
                );

                return (
                  <View key={hex} style={styles.skillLegendItem}>
                    <View
                      style={[
                        styles.skillLegendDot,
                        { backgroundColor: hex },
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

      {/* MOSAICOS CONCLUÍDOS */}
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
            {mosaicBadges.map((badge) => {
              const history = Array.isArray(badge.history)
                ? badge.history
                : [];
              return (
                <View key={badge.id} style={styles.badgeCard}>
                  <MosaicRenderer
                    currentMosaicIndex={badge.id}
                    pieces={history.length}
                    history={history}
                    size={100}
                  />
                  <Text style={styles.badgeTitle}>
                    Mosaico {badge.id}
                  </Text>
                  <Text style={styles.badgeDate}>
                    Concluído em {badge.completedAt}
                  </Text>
                </View>
              );
            })}
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

  // ===== HABILIDADES =====
  skillsCard: {
    backgroundColor: '#3E3C30',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  skillBarContainer: {
    marginTop: 12,
  },
  skillBarBackground: {
    height: 14,
    borderRadius: 999,
    backgroundColor: '#2C2B21',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  skillBarSegment: {
    height: '100%',
  },
  skillLegend: {
    marginTop: 8,
  },
  skillLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  skillLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  skillLegendText: {
    color: '#ECEFF1',
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
