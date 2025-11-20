# 🧩 MOSAICO — Plataforma de Desenvolvimento Profissional Gamificada
**Construa seu futuro peça por peça.**  
Aplicativo mobile desenvolvido em **React Native (Expo)** + **Firebase** + **Google Gemini AI**, combinando trilhas de aprendizado, gamificação e evolução visual por mosaicos.

---

## 📱 Sobre o Projeto

O **MOSAICO** é um app que ajuda profissionais e estudantes a desenvolverem habilidades essenciais para o futuro do trabalho através de:

- Trilhas de aprendizagem 📚  
- Recomendação inteligente com IA 🤖  
- Sistema gamificado de mosaicos 🎨  
- Missões diárias e semanais 🎯  
- Level, XP e progressão 🆙  
- Ranking global 🏆  
- Perfil com estatísticas profissionais 👤  

A cada aula concluída o usuário ganha **peças** que formam mosaicos — cada mosaico representa sua evolução em habilidades reais.

---

# 🚀 Tecnologias Utilizadas

### **Frontend**
- React Native (Expo)
- TypeScript
- React Navigation
- Expo Icons
- Context API para estados globais
- Animated e Gesture Handler

### **Backend / IA**
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Google Gemini API (recomendações inteligentes)

---

# 📌 Funcionalidades Principais

- Autenticação de usuários (Firebase)
- Cadastro com múltiplos passos
- Seleção de interesses
- Recomendação de trilhas (API Gemini)
- Missões diárias e semanais
- Sistema de XP e níveis
- Streak diário de atividades
- Trilhas de aprendizagem com progresso
- Conclusão de aulas e recompensas
- Sistema de mosaicos (gamificação)
- Peças por aula completada
- Mosaicos concluídos + badges
- Perfil do usuário com estatísticas
- Edição de interesses
- Ranking dos usuários (Top 50)
- Perfis públicos para visualização
- Salvamento e atualização de progresso no UserContext

---

# 📂 Arquitetura do Projeto

```txt
mosaico/
├─ assets/
│  └─ logo.png
├─ src/
│  ├─ components/
│  │  ├─ MissionsModal.tsx          # Modal de missões diárias/semanais
│  │  ├─ MosaicCanvas.tsx           # Canvas base para desenhar os mosaicos
│  │  ├─ MosaicRenderer.tsx         # Componente que escolhe qual SVG renderizar
│  │  ├─ MosaicSvg2.tsx             # SVG do Mosaico 2
│  │  ├─ MosaicSvg3.tsx             # SVG do Mosaico 3
│  │  ├─ MosaicSvg4.tsx             # SVG do Mosaico 4
│  │  ├─ MosaicSvg5.tsx             # SVG do Mosaico 5
│  │  ├─ MosaicSvgM.tsx             # SVG do Mosaico 1 (M)
│  │
│  ├─ context/
│  │  └─ UserContext.tsx            # Estado global do usuário, mosaicos, XP, interesses etc.
│  │
│  ├─ data/
│  │  └─ tracks.ts                  # Catálogo de trilhas (área, dificuldade, duração, cores...)
│  │
│  ├─ hooks/
│  │  └─ useDebounce.ts             # Hook para debounce de entrada (ex: busca de trilhas)
│  │
│  ├─ navigation/
│  │  ├─ AuthStack.tsx              # Fluxo de autenticação (Splash, Login, Register, Interests)
│  │  ├─ RootNavigator.tsx          # Stack principal (Tabs + MosaicScreen fullscreen)
│  │  └─ TabsNavigator.tsx          # Bottom Tabs (Home, Trilhas, Ranking*, Perfil)
│  │
│  ├─ screens/
│  │  ├─ HomeScreen.tsx             # Tela inicial com XP, streak, missões e trilhas recomendadas
│  │  ├─ InterestsScreen.tsx        # Tela de seleção de interesses após cadastro
│  │  ├─ LoginScreen.tsx            # Login com e-mail/senha + logo MOSAICO
│  │  ├─ MosaicScreen.tsx           # Tela “Meu Mosaico” + habilidades em destaque + badges
│  │  ├─ ProfileScreen.tsx          # Perfil do usuário, resumo de progresso e mosaico atual
│  │  ├─ PublicProfileScreen.tsx    # Perfil público (usado no ranking)
│  │  ├─ RankingScreen.tsx          # Ranking geral de usuários por XP
│  │  ├─ RegisterScreen.tsx         # Cadastro multi-etapas (nome, e-mail, senha, CPF)
│  │  ├─ SplashScreen.tsx           # Splash inicial
│  │  ├─ TrackDetailScreen.tsx      # Detalhes da trilha (carga horária, progresso, recompensas)
│  │  └─ TracksListScreen.tsx       # Lista completa de trilhas com filtros e busca
│  │
│  ├─ services/
│  │  ├─ firebaseConfig.ts          # Configuração do Firebase (Auth / Firestore)
│  │  └─ geminiClient.ts            # Cliente para chamadas à API Gemini (Google Generative AI)
│  │
│  ├─ styles/
│  │  └─ colors.ts                  # Paleta centralizada da UI
│  │
│  ├─ types/
│  │  ├─ models.ts                  # Tipos globais (User, Mission, RankingItem etc.)
│  │  └─ navigation.ts              # Tipagens dos stacks/tabs do React Navigation
│  │
│  └─ utils/
│     ├─ mosaic.ts                  # Funções utilitárias de cálculo de peças / distribuição
│     ├─ mosaicConfig.ts            # Configuração dos mosaicos (quantidade de segmentos, ordem...)
│     ├─ mosaicState.ts             # Lógica de cor/estado do mosaico atual
│     └─ xpConfig.ts                # Tabela de XP por nível, missões, aulas etc.
│
├─ App.tsx                          # Entry point do React Native (NavigationContainer + UserProvider)
├─ app.json                         # Config do Expo
├─ eas.json                         # Config do EAS (build/deploy)
├─ google-services.json             # Config Android do Firebase
├─ GoogleService-Info.plist         # Config iOS do Firebase
├─ tsconfig.json                    # Configuração do TypeScript
└─ package.json
```

---

# 🔁 Fluxos principais

## 1. Onboarding & Autenticação

### SplashScreen
- Checa estado de autenticação (Firebase Auth).
- Direciona para:
  - **LoginScreen**, se usuário não autenticado.
  - **AppRoot** (navegação principal), se já autenticado.

### LoginScreen
- Login com e-mail e senha (Firebase Auth).
- Ao logar:
  - Carrega dados do usuário (**XP, mosaicos, trilhas, interesses**) no `UserContext`.
  - Navega para **AppRoot** (`RootNavigator → TabsNavigator`).

### RegisterScreen
- Cadastro em **4 etapas**:
  1. Nome  
  2. E-mail  
  3. Senha  
  4. CPF  
- Ao finalizar:
  - Cria o usuário no Firebase.
  - Navega para **InterestsScreen**.

### InterestsScreen
- Usuário escolhe áreas de interesse (Tecnologia, Soft Skills, ESG, etc.).
- Interesses são salvos:
  - No `UserContext`.
  - No backend.
- Uma chamada à **API Gemini** gera uma lista de *IDs* de trilhas recomendadas.
- A lista de trilhas recomendadas é salva em `user.recommendedTrackIds`.
- Navega para **AppRoot** e o usuário cai na **Home** já com recomendações personalizadas.

---

## 2. Home (Dashboard de jornada)

**Tela:** `HomeScreen`

### Header
- Saudação personalizada: `Olá, {nome}! 👋`
- Badge de nível (nível atual + “classe” como *Construtor*, *Arquiteto* etc.).
- Barra de XP até o próximo nível.

### Streak
- Card em destaque com 🔥 e contagem de dias consecutivos com atividade.
- Atalho para ver o mosaico: botão **“Ver meu MOSAICO”**.

### Missões do dia
- Lista de **2 missões** visíveis (ex.: “Concluir uma aula”, “Estudar 15 minutos”).
- Cada missão mostra:
  - Descrição
  - Recompensa em peças (✨) e XP (⚡)
- Botão **“ver todas →”** abre o `MissionsModal`:
  - Abas **Diárias** e **Semanais**
  - Estado da missão: **“Em andamento” / “Concluída”**
  - Recompensa por missão

### Trilhas recomendadas
- Usa `user.recommendedTrackIds` (preenchido pela Gemini).
- Se não houver recomendação ainda, exibe fallback padrão (primeiras trilhas).
- Cada card mostra:
  - Área (pill) + dificuldade
  - Descrição curta
  - Progresso atual (aulas concluídas / total)
- Botão **“Ir para trilha”**:
  - Leva para `TracksListScreen` ou `TrackDetailScreen`.

---

## 3. Trilhas (explorar & detalhar)

### 3.1. Lista de trilhas

**Tela:** `TracksListScreen`

- Campo de busca no topo: **“Qual habilidade você busca hoje?”**  
  - Usa `useDebounce`.
- Filtros rápidos por área:
  - Todas, Tecnologia, Soft Skills, ESG, Dados, etc.
- Cards de trilha:
  - Badge de área (Tecnologia, ESG…)
  - Título + descrição curta
  - Linha com:
    - ⏱️ carga horária aproximada
    - 🔢 quantidade de aulas
  - Barra de progresso (aulas concluídas / total)
  - Texto: **“Toque para ver detalhes da trilha →”**
- Ao tocar no card:
  - Navega para `TrackDetailScreen`.

### 3.2. Detalhe da trilha

**Tela:** `TrackDetailScreen`

- Área no topo + título da trilha.
- Blocos com informações:
  - Dificuldade
  - Carga horária estimada
  - Aulas totais
  - Recompensas: ✨ *X peças* + ⚡ *Y XP*
- Card de progresso:
  - Texto: **“N/M aulas concluídas (P%)”**
  - Barra de progresso
  - Mensagem:  
    > “Complete todas as aulas para ganhar as recompensas desta trilha.”
- Botão de ação:
  - **“Concluir aula #N”** (para testes e simulação local)  
  - Ou **“Trilha concluída ✅”** quando 100%.
- Cada aula concluída aciona `completeLesson(trackId)` no `UserContext`:
  - Atualiza `trackProgress`.
  - Incrementa `lessonsCompleted`.
  - Gera XP adicional.
  - Concede **uma peça** para o mosaico, com cor atrelada à área da trilha.

---

## 4. Mosaicos & Gamificação

### 4.1. Lógica de mosaico

- Configurada em:
  - `utils/mosaicConfig.ts`
  - `utils/mosaicState.ts`
- `MOSAICO_SEGMENTS[mosaicIndex]` define quantas peças são necessárias em cada mosaico.
- `UserContext` mantém:
  - `currentMosaicIndex`
  - `currentMosaicPieces`
  - `currentMosaicHistory` (array de cores das peças)
  - `mosaicBadges`: lista de mosaicos concluídos (`id`, `data`, `histórico de cores`)

**Fluxo:**
1. `completeLesson(trackId)` chama `addPieceToMosaic(color)`.
2. A cor é definida conforme a trilha (`getColorForTrack`).
3. Quando `currentMosaicPieces` atinge o total de segmentos:
   - O mosaico é salvo em `mosaicBadges`.
   - `currentMosaicIndex` é incrementado.
   - `currentMosaicPieces` e `currentMosaicHistory` são resetados.
   - Usuário sobe de nível (`level++`).

### 4.2. Tela “Meu Mosaico”

**Tela:** `MosaicScreen`

- **Card principal:**
  - Se ainda há mosaico em andamento:
    - Mostra o mosaico atual renderizado (`MosaicRenderer`).
    - Progresso: **“X/Y peças concluídas”**.
  - Se todos os mosaicos estão concluídos:
    - Mensagem de **“Mestre do Mosaico”** com contagem **5/5**.

- **Habilidades em destaque:**
  - Soma todas as cores (ESG, Tecnologia, Soft Skills, etc.) de todos os mosaicos.
  - Exibe uma barra segmentada e legenda com percentuais.

- **Mosaicos concluídos:**
  - Carrossel horizontal com os 5 mosaicos (1 a 5).
  - Ao tocar em um mosaico, abre um modal de detalhes:
    - Data de conclusão
    - Total de peças
    - Distribuição de habilidades nesse mosaico específico (cores + percentuais).

---

## 5. Perfil & Ranking

### 5.1. Perfil

**Tela:** `ProfileScreen`

- Saudação + ícones de configurações e logout.
- Card **“Mosaico completo”** quando todos os mosaicos foram concluídos:
  - Mostra quantos mosaicos existem e quantos o usuário fez.
  - Mensagem:  
    > “Você se tornou um verdadeiro Mestre do Mosaico.”
- Seção **“Suas áreas de interesse”**:
  - Chips com interesses atuais.
  - Botão **Editar**, que leva para tela de edição de interesses.
- Seção **“Seu progresso”**:
  - Trilhas ativas
  - Aulas concluídas
  - Áreas exploradas
  - Progresso geral

### 5.2. Editar interesses

**Tela:** `InterestsScreen` (modo edição)

- Mesmo visual do onboarding, mas com botão **“Salvar alterações”**.
- Atualiza `user.interests` e **refaz as recomendações via Gemini**.

### 5.3. Ranking

**Tela:** `RankingScreen`

- Lista dos **top 50 usuários** por XP.
- Primeiros colocados:
  - Cores diferenciadas (ouro, prata, bronze).
- Demais posições com layout uniforme.
- Ao tocar em um usuário:
  - Abre `PublicProfileScreen` com:
    - Nível
    - Habilidades em destaque (barra segmentada)
    - Mosaicos concluídos (como na tela do usuário, porém somente leitura).

---

# Integrantes
<table>
  <tr>
    <th>Nome</th>
    <th>RM</th>
    <th>Turma</th>
  </tr>
  <tr>
    <td>Thiago Jardim de Oliveira</td>
    <td>551624</td>
    <td>3ESPF</td>
  </tr>
  <tr>
    <td>Nikolas Rodrigues Moura dos Santos</td>
    <td>551566</td>
    <td>3ESPF</td>
  </tr>
  <tr>
    <td>Guilherme Rocha Bianchini</td>
    <td>97974</td>
    <td>3ESPF</td>
  </tr>
  <tr>
    <td>Pedro Henrique Pedrosa Tavares</td>
    <td>97877</td>
    <td>3ESPF</td>
  </tr>
  <tr>
    <td>Rodrigo Brasileiro</td>
    <td>98952</td>
    <td>3ESPF</td>
  </tr>
</table>

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos e experimentais. <br>
Sinta-se à vontade para clonar, estudar, adaptar e evoluir o MOSAICO como base para outros projetos de educação, carreira e gamificação.
