import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

const HomeScreen: React.FC = () => {
  const { user, registerDailyLogin } = useUser();

useEffect(() => {
  registerDailyLogin();
  // queremos rodar apenas uma vez na montagem da Home
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const levelProgressPercent = Math.min(((user.xp % 100) / 100) * 100, 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MOSAICO</Text>
      <Text style={styles.subtitle}>
        Cada habilidade é uma peça. Juntas, formam o futuro do trabalho.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nível {user.level}</Text>
        <Text style={styles.cardText}>{user.xp} XP</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${levelProgressPercent}%` }]} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Streak diário</Text>
        <Text style={styles.cardText}>{user.streak} dias seguidos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumo do seu MOSAICO</Text>
        <Text style={styles.cardText}>Peças acumuladas: {user.pieces}</Text>
        <Text style={styles.cardText}>Badges conquistadas: {user.badges.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Missões de hoje</Text>
        <TouchableOpacity style={styles.missionItem}>
          <Text>✅ Concluir 1 aula</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.missionItem}>
          <Text>📚 Estudar por 20 minutos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#0F766E',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#E0F2F1',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#0F766E',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  missionItem: {
    paddingVertical: 8,
  },
});

export default HomeScreen;
