// src/screens/PublicProfileScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { UserData, MosaicBadge } from '../context/UserContext';
import MosaicRenderer from '../components/MosaicRenderer';
import { MOSAICO_SEGMENTS, MosaicIndex } from '../utils/mosaicConfig';
import { LEVEL_DATA } from '../utils/xpConfig';
import { colors } from '../styles/colors';

// Mapeamento de cores para nomes de habilidades
const COLOR_TO_SKILL_LABEL: Record<string, string> = {
  '#4DB6AC': 'Tecnologia', '#D1C4E9': 'Soft Skills', '#FFD54F': 'ESG',
  '#A3E6D5': 'Dados', '#90CAF9': 'Liderança', '#FFAB91': 'Produtividade',
  '#EC407A': 'Marketing & Vendas', '#66BB6A': 'Finanças & Investimentos',
  '#7E57C2': 'Design & UX', '#FFA726': 'Inovação & Empreendedorismo',
};

type Props = NativeStackScreenProps<RootStackParamList, 'PublicProfile'>;

const PublicProfileScreen = ({ route }: Props) => {
  const { userId } = route.params;
  const [publicUser, setPublicUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setPublicUser({ uid: userDoc.id, ...userDoc.data() } as UserData);
        } else {
          console.log("Usuário não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil público:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const { colorEntries, totalPiecesFromColors, hasSkills } = useMemo(() => {
    if (!publicUser) return { colorEntries: [], totalPiecesFromColors: 0, hasSkills: false };
    
    const allColors: string[] = [...(publicUser.currentMosaicHistory ?? [])];
    (publicUser.mosaicBadges ?? []).forEach(badge => allColors.push(...(badge.history ?? [])));
    
    const counts: Record<string, number> = {};
    allColors.forEach(raw => {
      const key = raw.trim().toUpperCase();
      if(key) counts[key] = (counts[key] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, val]) => sum + val, 0);
    return { colorEntries: entries, totalPiecesFromColors: total, hasSkills: total > 0 };
  }, [publicUser]);

  if (loading) {
    return <View style={styles.containerCenter}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (!publicUser) {
    return <View style={styles.containerCenter}><Text style={styles.emptyText}>Perfil não encontrado.</Text></View>;
  }

  const levelTitle = LEVEL_DATA[publicUser.level]?.title ?? '';

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho do Perfil */}
      <View style={styles.header}>
        <Text style={styles.name}>{publicUser.name}</Text>
        <Text style={styles.level}>Nível {publicUser.level} · {levelTitle}</Text>
      </View>

      {/* Barra de Habilidades */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Habilidades em destaque</Text>
        {!hasSkills ? (
          <Text style={styles.emptyText}>Este usuário ainda não começou sua jornada.</Text>
        ) : (
          <View style={styles.skillBarContainer}>
            <View style={styles.skillBarBackground}>
              {colorEntries.map(([color, value]) => <View key={color} style={{ flex: value, backgroundColor: color }} />)}
            </View>
            <View style={styles.skillLegend}>
              {colorEntries.map(([color, value]) => {
                const label = COLOR_TO_SKILL_LABEL[color] ?? 'Outras';
                const pct = Math.round((value / totalPiecesFromColors) * 100);
                return (
                  <View key={color} style={styles.skillLegendItem}>
                    <View style={[styles.skillLegendDot, { backgroundColor: color }]} />
                    <Text style={styles.skillLegendText}>{label} · {pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Mosaicos Concluídos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mosaicos Concluídos</Text>
        {(publicUser.mosaicBadges ?? []).length === 0 ? (
          <Text style={styles.emptyText}>Nenhum mosaico concluído ainda.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12 }}>
            {(publicUser.mosaicBadges as MosaicBadge[]).map(badge => (
              <View key={badge.id} style={styles.badgeCard}>
                <MosaicRenderer
                  currentMosaicIndex={badge.id}
                  pieces={badge.history.length}
                  history={badge.history}
                  size={80}
                  showGlow={false}
                />
                <Text style={styles.badgeTitle}>Mosaico {badge.id}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, },
  containerCenter: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.surface },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  level: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 16, margin: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic' },
  skillBarContainer: {},
  skillBarBackground: { height: 14, borderRadius: 7, backgroundColor: colors.background, flexDirection: 'row', overflow: 'hidden' },
  skillLegend: { marginTop: 10 },
  skillLegendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  skillLegendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  skillLegendText: { fontSize: 12, color: colors.textSecondary },
  badgeCard: { width: 120, alignItems: 'center', marginRight: 12 },
  badgeTitle: { color: colors.textPrimary, fontSize: 12, fontWeight: '500', marginTop: 4 },
});

export default PublicProfileScreen;