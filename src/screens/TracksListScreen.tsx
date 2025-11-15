import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TRACKS } from '../data/tracks';
import { useUser } from '../context/UserContext';

const TracksListScreen: React.FC = () => {
  const { user, completeLesson } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trilhas MOSAICO</Text>

      <FlatList
        data={TRACKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress = user.progress[item.id]?.completedLessons ?? 0;
          const percent = Math.round((progress / item.totalLessons) * 100);

          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>
                Aulas concluídas: {progress}/{item.totalLessons} ({isNaN(percent) ? 0 : percent}%)
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => completeLesson(item.id)}
              >
                <Text style={styles.buttonText}>Concluir +1 aula</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F1F5F9' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#0F172A' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardText: { fontSize: 14, marginBottom: 8 },
  button: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});

export default TracksListScreen;
