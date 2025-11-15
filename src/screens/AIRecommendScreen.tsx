import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIRecommendScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recomendações com IA</Text>
      <Text>Em breve: integração com API para recomendar trilhas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});

export default AIRecommendScreen;
