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
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useUser } from '../context/UserContext';
import { TRACKS } from '../data/tracks';

// O tipo `Props` é uma UNIÃO, aceitando as props de ambos os navegadores.
type Props =
  | NativeStackScreenProps<AuthStackParamList, 'Interests'>
  | NativeStackScreenProps<RootStackParamList, 'Interests'>;

const INTEREST_OPTIONS = [
  'Tecnologia', 'Soft Skills', 'ESG', 'Dados', 'Liderança', 'Produtividade',
  'Marketing & Vendas', 'Finanças & Investimentos', 'Design & UX', 'Inovação & Empreendedorismo',
];

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY';

const InterestsScreen = ({ navigation, route }: Props) => {
  const { user, updateInterests, setRecommendedTracks } = useUser();

  const isEditMode = 'editMode' in route.params;

  const initialInterests = isEditMode ? (user.interests ?? []) : [];
  const [selected, setSelected] = useState<string[]>(initialInterests);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((i) => i !== value)
        : [...current, value],
    );
  };

  const handleFinish = async () => {
    if (selected.length === 0) return;

    setLoading(true);
    updateInterests(selected);

    if (isEditMode) {
      setLoading(false);
      navigation.goBack();
      return;
    }

    const { form } = route.params as AuthStackParamList['Interests'];
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
        } catch {}
      }
    } catch (e) {
      console.error("Erro na chamada da API Gemini:", e);
    }

    if (recommendedIds.length === 0) {
      recommendedIds = TRACKS.filter((t) =>
        selected.includes(t.area),
      )
        .slice(0, 3)
        .map((t) => t.id);
    }

    setRecommendedTracks(recommendedIds);
    setLoading(false);

    // MODIFICAÇÃO: Usamos uma afirmação de tipo para dizer ao TypeScript
    // que, neste ponto do código, 'navigation' é do tipo do AuthStack.
    (navigation as NativeStackNavigationProp<AuthStackParamList>).replace('AppRoot');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        {isEditMode ? 'Atualize seus interesses' : 'Quais são os seus interesses?'}
      </Text>
      <Text style={styles.subtitle}>
        {isEditMode ? 'Suas recomendações serão ajustadas.' : 'Vamos recomendar trilhas que combinem com o seu momento.'}
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
            {isEditMode ? 'Salvar Alterações' : 'Continuar para o MOSAICO'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerHint}>
        {isEditMode ? 'Suas novas preferências serão salvas.' : 'Você poderá alterar suas preferências depois.'}
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