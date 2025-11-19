// src/services/geminiClient.ts
import { TRACKS, Track } from '../data/tracks';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyCHI-ICWv0Fy1L-LYHXM_5i3sBrAcSnXl8';

// Função utilitária: monta o prompt e chama a API
export async function fetchTrackRecommendationsFromGemini(
  interests: string[],
): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key não configurada. Retornando sem recomendações.');
    return [];
  }

  // Vamos mandar uma visão simplificada das trilhas para o modelo
  const simplifiedTracks = TRACKS.map((t) => ({
    id: t.id,
    title: t.title,
    area: t.area,
    difficulty: t.difficulty,
    description: t.description,
  }));

  const prompt = `
Você é um sistema de recomendação de trilhas de aprendizagem.

Usuário marcou interesse nas áreas: ${interests.join(', ') || 'nenhuma'}.

Aqui está a lista de trilhas disponíveis (em JSON):
${JSON.stringify(simplifiedTracks, null, 2)}

Escolha NO MÁXIMO 4 trilhas mais alinhadas aos interesses do usuário.
Responda APENAS com um JSON contendo um array de IDs de trilhas.

Exemplo de resposta:
["ia-fundamentos", "softskills-futuro"]
`;

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
    GEMINI_API_KEY;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.warn('Erro na chamada Gemini:', res.status, await res.text());
      return [];
    }

    const json = await res.json();
    const text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!text) return [];

    // remove ```json ... ``` se vier assim
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn('Falha ao fazer JSON.parse da resposta Gemini:', cleaned);
      return [];
    }

    if (!Array.isArray(parsed)) return [];

    // filtra apenas IDs válidos
    const validIds = new Set(TRACKS.map((t) => t.id));
    const trackIds = parsed
      .filter((id: any) => typeof id === 'string' && validIds.has(id));

    return trackIds;
  } catch (err) {
    console.warn('Erro geral ao chamar Gemini:', err);
    return [];
  }
}
