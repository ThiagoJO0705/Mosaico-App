// src/screens/InterestsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Interests'>;

const ALL_INTERESTS = [
  'Tecnologia',
  'Inteligência Artificial',
  'Soft Skills',
  'Liderança',
  'ESG & Sustentabilidade',
  'Carreira & Futuro do Trabalho',
  'Produtividade',
  'Comunicação',
];

const InterestsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { form } = route.params;
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleFinish = () => {
    // aqui você poderia salvar `form` + `selected` no contexto ou backend
    // por enquanto só entra no app principal
    navigation.reset({
      index: 0,
      routes: [{ name: 'AppRoot' }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* topo */}
      <View style={styles.header}>
        <Text style={styles.brand}>MOSÁICO</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Quais são seus interesses, {form.name.split(' ')[0]}?</Text>
        <Text style={styles.subtitle}>
          Vamos usar isso para recomendar trilhas e montar um MOSAICO ainda
          mais alinhado ao seu momento.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Escolha seus temas favoritos</Text>
          <Text style={styles.cardSubtitle}>
            Você pode mudar isso depois nas configurações.
          </Text>

          <View style={styles.chipsContainer}>
            {ALL_INTERESTS.map((interest) => {
              const isActive = selected.includes(interest);
              return (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.chip,
                    isActive && styles.chipActive,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isActive && styles.chipTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do seu perfil</Text>
          <Text style={styles.summaryItem}>
            👤 <Text style={styles.summaryLabel}>Nome:</Text> {form.name}
          </Text>
          <Text style={styles.summaryItem}>
            📧 <Text style={styles.summaryLabel}>E-mail:</Text> {form.email}
          </Text>
          <Text style={styles.summaryItem}>
            🧩 <Text style={styles.summaryLabel}>Interesses:</Text>{' '}
            {selected.length === 0
              ? 'Nenhum selecionado ainda'
              : selected.join(', ')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            selected.length === 0 && styles.primaryButtonDisabled,
          ]}
          onPress={handleFinish}
          activeOpacity={selected.length === 0 ? 1 : 0.8}
        >
          <Text style={styles.primaryButtonText}>
            Começar minha jornada
          </Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Suas escolhas ajudam a IA do MOSAICO a sugerir trilhas mais
          relevantes para o seu futuro profissional.
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A', // fundo principal
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  brand: {
    color: '#F5F5F5',
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2A3B4C',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#B0BEC5',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4DB6AC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 4,
    marginBottom: 6,
  },
  chipActive: {
    backgroundColor: '#4DB6AC',
    borderColor: '#4DB6AC',
  },
  chipText: {
    color: '#A3E6D5',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#1C2A3A',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#F5F5F5',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryItem: {
    color: '#CFD8DC',
    fontSize: 13,
    marginTop: 2,
  },
  summaryLabel: {
    color: '#F5F5F5',
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: '#4DB6AC',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#1C2A3A',
    fontSize: 15,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 10,
    color: '#B0BEC5',
    fontSize: 12,
  },
});

export default InterestsScreen;
