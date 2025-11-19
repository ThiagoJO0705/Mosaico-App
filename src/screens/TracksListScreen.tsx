// src/screens/TracksListScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TRACKS, TrackArea } from '../data/tracks';
import { useUser } from '../context/UserContext';

const FILTERS: (TrackArea | 'Todas')[] = [
  'Todas',
  'Tecnologia',
  'Soft Skills',
  'ESG',
  'Dados',
  'Liderança',
  'Produtividade',
];

const TracksListScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<(TrackArea | 'Todas')>(
    'Todas',
  );

  const tracksData = useMemo(() => {
    const base = Array.isArray(TRACKS) ? TRACKS : [];

    return base.filter((track) => {
      const matchesFilter =
        selectedFilter === 'Todas' || track.area === selectedFilter;

      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        track.title.toLowerCase().includes(term) ||
        track.description.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho + busca */}
        <Text style={styles.title}>Trilhas MOSAICO</Text>
        <Text style={styles.subtitle}>
          Encontre a trilha certa para o próximo passo da sua jornada.
        </Text>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Qual habilidade você busca hoje?"
            placeholderTextColor="#90A4AE"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filtros rápidos */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lista de trilhas (resumo) */}
        <FlatList
          data={tracksData}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const trackProg =
              user.trackProgress[item.id]?.completedLessons ?? 0;
            const percent = Math.round(
              (trackProg / item.totalLessons) * 100,
            );
            const clampedPercent = isNaN(percent) ? 0 : percent;

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('TrackDetail', { trackId: item.id })
                }
              >
                {/* Tag de área / dificuldade */}
                <View style={styles.cardTagsRow}>
                  <View style={[styles.tag, { backgroundColor: '#263545' }]}>
                    <Text style={styles.tagText}>{item.area}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: '#37475A' }]}>
                    <Text style={styles.tagText}>{item.difficulty}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.cardDescription}>
                  {item.description}
                </Text>

                {/* Linha de meta / resumo */}
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardMetaText}>
                    🕒 {Math.round(item.durationMinutes / 60)}h ·{' '}
                    {item.totalLessons} aulas
                  </Text>
                  <Text style={styles.cardMetaText}>
                    {clampedPercent}% concluído
                  </Text>
                </View>

                {/* Barra de progresso fina */}
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${clampedPercent}%` },
                    ]}
                  />
                </View>

                <Text style={styles.cardHint}>
                  Toque para ver detalhes da trilha →
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma trilha encontrada. Ajuste o filtro ou a busca.
            </Text>
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
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
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#2A3B4C',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F5F5F5',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#455A64',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#4DB6AC',
    borderColor: '#4DB6AC',
  },
  filterPillText: {
    color: '#B0BEC5',
    fontSize: 12,
  },
  filterPillTextActive: {
    color: '#1C2A3A',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#2A3B4C',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  cardTagsRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 6,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: '#CFD8DC',
    fontSize: 11,
  },
  cardTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#B0BEC5',
    fontSize: 13,
    marginBottom: 8,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardMetaText: {
    color: '#CFD8DC',
    fontSize: 12,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#1C2A3A',
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#A3E6D5',
  },
  cardHint: {
    color: '#D1C4E9',
    fontSize: 11,
    marginTop: 2,
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 13,
    marginTop: 16,
  },
});

export default TracksListScreen;
