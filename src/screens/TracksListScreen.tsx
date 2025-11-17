import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { TRACKS } from '../data/tracks';
import { useUser } from '../context/UserContext';
import { colors } from '../styles/colors';

const FILTERS = ['Todas', 'Tecnologia', 'Soft Skills', 'ESG', 'Novidades'];

const TracksListScreen: React.FC = () => {
  const { user, completeLesson } = useUser() as any;

  const tracksData = Array.isArray(TRACKS) ? TRACKS : [];

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Todas');

  // ---- Helpers de progressão por trilha ----
  const getTrackProgress = (trackId: string, totalLessons: number) => {
    const completed = user?.trackProgress?.[trackId]?.completedLessons ?? 0;
    const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return { completed, percent };
  };

  // ---- Filtro por busca + categoria ----
  const filteredTracks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tracksData.filter((t: any) => {
      const title = (t.title || '').toLowerCase();
      const description = (t.description || '').toLowerCase();
      const area = (t.area || t.category || '').toLowerCase();

      // busca
      if (q && !title.includes(q) && !description.includes(q) && !area.includes(q)) {
        return false;
      }

      // filtro rápido
      if (activeFilter === 'Todas') return true;

      if (activeFilter === 'Tecnologia') {
        return ['tech', 'tecnologia', 'ia', 'inteligência artificial'].some((k) =>
          area.includes(k),
        );
      }

      if (activeFilter === 'Soft Skills') {
        return ['soft', 'comportamental', 'liderança', 'comunicação'].some((k) =>
          area.includes(k),
        );
      }

      if (activeFilter === 'ESG') {
        return ['esg', 'sustentabilidade', 'governança'].some((k) =>
          area.includes(k),
        );
      }

      if (activeFilter === 'Novidades') {
        return !!t.isNew || !!t.isFeatured;
      }

      return true;
    });
  }, [tracksData, search, activeFilter]);

  // ---- Seções: continue / recomendado / todas ----
  const inProgressTracks = filteredTracks.filter((t: any) => {
    const { completed, percent } = getTrackProgress(t.id, t.totalLessons);
    return completed > 0 && percent < 100;
  });

  const recommendedTracks = filteredTracks
    .filter((t: any) => {
      const { completed } = getTrackProgress(t.id, t.totalLessons);
      return completed === 0;
    })
    .slice(0, 5);

  const hasAnyTrack = filteredTracks.length > 0;

  const renderTrackCard = (item: any) => {
    const { completed, percent } = getTrackProgress(item.id, item.totalLessons);

    const difficulty = item.difficulty || 'Iniciante';
    const estimatedTime = item.estimatedTime || '4 horas';
    const area = item.area || item.category || 'Tecnologia';
    const rewardPieces = item.rewardPieces ?? 5;
    const rewardXp = item.rewardXp ?? 50;
    const emoji = item.emoji || item.icon || '📚';

    const isCompleted = percent >= 100;

    return (
      <View
        key={item.id}
        style={[
          styles.card,
          (item.isFeatured || item.isNew) && styles.cardFeatured,
        ]}
      >
        {/* topo: ícone + título + badge "Novo" */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{emoji}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>

            {item.isNew && <Text style={styles.badgeNew}>Novo</Text>}
            {item.isFeatured && !item.isNew && (
              <Text style={styles.badgeFeatured}>Em destaque</Text>
            )}
          </View>
        </View>

        {/* descrição */}
        {!!item.description && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* tags / metadados */}
        <View style={styles.tagsRow}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{difficulty}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>🕒 {estimatedTime}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{area}</Text>
          </View>
        </View>

        {/* progresso */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            {isCompleted
              ? 'Trilha concluída'
              : `Aulas concluídas: ${completed}/${item.totalLessons}`}
          </Text>
          <Text style={styles.progressPercent}>
            {isCompleted ? '100%' : `${isNaN(percent) ? 0 : percent}%`}
          </Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, percent))}%` },
            ]}
          />
        </View>

        {/* recompensa + botão */}
        <View style={styles.footerRow}>
          <Text style={styles.rewardText}>
            ✨ +{rewardPieces} peças · +{rewardXp} XP
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => completeLesson(item.id)}
          >
            <Text style={styles.primaryButtonText}>
              {isCompleted ? 'Rever conteúdo' : completed > 0 ? 'Continuar' : 'Começar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Cabeçalho */}
      <Text style={styles.title}>Trilhas MOSAICO</Text>
      <Text style={styles.subtitle}>
        Encontre a trilha ideal para evoluir seu MOSAICO de habilidades.
      </Text>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Qual habilidade você busca hoje?"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => {
          const selected = f === activeFilter;
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterPill,
                selected && styles.filterPillSelected,
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selected && styles.filterPillTextSelected,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!hasAnyTrack && (
        <Text style={styles.emptyStateText}>
          Nenhuma trilha encontrada com esses filtros. Tente outra busca ou
          categoria.
        </Text>
      )}

      {hasAnyTrack && (
        <>
          {/* Continue de onde parou */}
          {inProgressTracks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Continue de onde parou</Text>
              {inProgressTracks.map(renderTrackCard)}
            </View>
          )}

          {/* Recomendado para você */}
          {recommendedTracks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recomendado para você</Text>
              {recommendedTracks.map(renderTrackCard)}
            </View>
          )}

          {/* Todas as Trilhas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todas as trilhas</Text>
            {filteredTracks.map(renderTrackCard)}
          </View>
        </>
      )}

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
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },

  // busca
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#223347',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },

  // filtros
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#3B4C5D',
    backgroundColor: 'transparent',
  },
  filterPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  filterPillTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },

  section: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 16,
  },

  // card de trilha
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardFeatured: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#223347',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconEmoji: {
    fontSize: 22,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  badgeNew: {
    marginTop: 2,
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  badgeFeatured: {
    marginTop: 2,
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#223347',
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  progressPercent: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#223347',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TracksListScreen;
