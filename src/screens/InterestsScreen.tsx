// src/screens/InterestsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation'; // garante que aqui tenha a rota "Interests" e "AppRoot"
import { useUser } from '../context/UserContext';
import { TRACKS } from '../data/tracks';

type Props = NativeStackScreenProps<AuthStackParamList, 'Interests'>;

const INTEREST_OPTIONS = [
  'Tecnologia',
  'Soft Skills',
  'ESG',
  'Dados',
  'Liderança',
  'Produtividade',
];

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY';

const InterestsScreen: React.FC<Props> = ({ navigation, route }) => {
  // se quiser usar depois pra salvar no backend, o form já está aqui:
  const { form } = route.params;

  const { updateInterests, setRecommendedTracks } = useUser();

  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((i) => i !== value)
        : [...current, value],
    );
  };

  const handleFinish = async () => {
    if (selected.length === 0) {
      // força selecionar ao menos 1 interesse
      return;
    }

    // 1) salva interesses no contexto
    updateInterests(selected);

    setLoading(true);
    let recommendedIds: string[] = [];

    try {
      const trackListForPrompt = TRACKS.map(
        (t) => `${t.id} (${t.area})`,
      ).join(', ');

      const prompt = `
O usuário acabou de se cadastrar no app MOSAICO.
Áreas de interesse selecionadas: ${selected.join(', ')}.

Temos as seguintes trilhas disponíveis (id - área):
${trackListForPrompt}.

Escolha de 2 a 4 trilhas que façam mais sentido para esse usuário.
Responda APENAS um JSON no formato:
{"tracks":["id-1","id-2","id-3"]}.
`;

      const resp = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        try {
          const parsed = JSON.parse(text);
          if (parsed && Array.isArray(parsed.tracks)) {
            recommendedIds = parsed.tracks.filter((id: string) =>
              TRACKS.some((t) => t.id === id),
            );
          }
        } catch {
          // se não der pra parsear, cai no fallback abaixo
        }
      }
    } catch (e) {
      // erro de rede / chave / etc → ignora e vai pro fallback
    }

    // 2) Fallback: até 3 trilhas que batem com as áreas escolhidas
    if (recommendedIds.length === 0) {
      recommendedIds = TRACKS.filter((t) =>
        selected.includes(t.area),
      )
        .slice(0, 3)
        .map((t) => t.id);
    }

    setRecommendedTracks(recommendedIds);

    setLoading(false);

    // 3) entra no app principal (RootNavigator -> Tabs)s
    navigation.replace('AppRoot'); // 👈 AGORA VAI PRO MENU/TABS
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Quais são os seus interesses?</Text>
      <Text style={styles.subtitle}>
        Vamos recomendar trilhas que combinem com o seu momento.
      </Text>

      <View style={styles.chipsContainer}>
        {INTEREST_OPTIONS.map((interest) => {
          const active = selected.includes(interest);
          return (
            <TouchableOpacity
              key={interest}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggleInterest(interest)}
            >
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {interest}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 24 }} />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          (selected.length === 0 || loading) && styles.primaryButtonDisabled,
        ]}
        disabled={selected.length === 0 || loading}
        onPress={handleFinish}
      >
        {loading ? (
          <ActivityIndicator color="#1C2A3A" />
        ) : (
          <Text style={styles.primaryButtonText}>
            Continuar para o MOSAICO
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerHint}>
        Você poderá alterar suas preferências depois.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginBottom: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4DB6AC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#4DB6AC',
  },
  chipText: {
    color: '#A3E6D5',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#1C2A3A',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#4DB6AC',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#1C2A3A',
    fontSize: 15,
    fontWeight: '700',
  },
  footerHint: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default InterestsScreen;
