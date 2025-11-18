import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { TRACKS } from '../data/tracks';

type MissionType = 'daily' | 'weekly';

type Mission = {
  id: string;
  title: string;
  description?: string;
  type: MissionType;
  rewardPieces: number;
  rewardXp: number;
  current: number;
  target: number;
  completed: boolean;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser();

  const XP_PER_LEVEL = 100; // ajuste se quiser outro valor por nível

  const totalXp = user.xp ?? 0;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;           // XP já acumulado neste nível
  const xpPercent = (xpIntoLevel / XP_PER_LEVEL) * 100; // 0 a 100%
  const xpRemaining = XP_PER_LEVEL - xpIntoLevel;  

  const tracksData = Array.isArray(TRACKS) ? TRACKS : [];

  // ========= MISSÕES =========
  const [missions] = useState<Mission[]>([
    {
      id: 'd1',
      type: 'daily',
      title: 'Concluir uma aula de qualquer trilha',
      description: 'Dê mais um passo na sua jornada hoje.',
      rewardPieces: 1,
      rewardXp: 10,
      current: 0,
      target: 1,
      completed: false,
    },
    {
      id: 'd2',
      type: 'daily',
      title: 'Estudar por 15 minutos hoje',
      description: 'Reserve um foco rápido para você.',
      rewardPieces: 1,
      rewardXp: 15,
      current: 0,
      target: 1,
      completed: false,
    },
    {
      id: 'w1',
      type: 'weekly',
      title: 'Concluir 5 aulas nesta semana',
      description: 'Mantenha a consistência e avance de verdade.',
      rewardPieces: 3,
      rewardXp: 60,
      current: 0,
      target: 5,
      completed: false,
    },
  ]);

  const [missionsModalVisible, setMissionsModalVisible] = useState(false);
  const [activeMissionTab, setActiveMissionTab] =
    useState<MissionType>('daily');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dailyMissions = useMemo(
    () => missions.filter((m) => m.type === 'daily'),
    [missions],
  );
  const weeklyMissions = useMemo(
    () => missions.filter((m) => m.type === 'weekly'),
    [missions],
  );

  const visibleMissions =
    activeMissionTab === 'daily' ? dailyMissions : weeklyMissions;

  // auto esconder toast (caso no futuro você use setToastMessage de outro lugar)
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // ========= UI HOME =========
  return (
    <View style={styles.root}>
      <ScrollView style={styles.container}>
        {/* Topo: saudação + badge de nível */}
        <View style={styles.header}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.greeting}>Olá, {user.name}! 👋</Text>
            <Text style={styles.subtitle}>
              O futuro do trabalho se constrói peça por peça.
            </Text>
          </View>

          <View style={styles.levelBadge}>
            <Text style={styles.levelLabel}>Nível</Text>
            <Text style={styles.levelValue}>{user.level}</Text>
            <Text style={styles.levelTag}>Construtor 💎</Text>
          </View>
        </View>

        {/* Barra de XP fina */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP para o próximo nível</Text>
            <Text style={styles.xpValue}>{xpRemaining} XP</Text>
          </View>
          <View style={styles.xpBarBackground}>
            <View
              style={[
                styles.xpBarFill,
                { width: `${xpPercent}%` }, // 👈 agora é baseado no nível atual
              ]}
            />
          </View>
        </View>

        {/* Streak + atalho para perfil/mosaico */}
        <View style={styles.row}>
          {/* STREAK EM DESTAQUE */}
          <View style={styles.streakCard}>
            <View style={styles.streakIconBubble}>
              <Text style={styles.streakIcon}>🔥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>
                {user.streakDays} dias de jornada
              </Text>
              <Text style={styles.streakSubtitle}>
                Manter a consistência é o que constrói o seu MOSAICO.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileShortcut}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Text style={styles.profileShortcutTitle}>Ver meu MOSAICO</Text>
            <Text style={styles.profileShortcutSubtitle}>
              Acompanhe sua evolução visual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Missões do dia (resumo) – também em destaque */}
        <View style={styles.section}>
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionTitle}>Missões do dia</Text>
    <TouchableOpacity onPress={() => setMissionsModalVisible(true)}>
      <Text style={styles.sectionLink}>ver todas ⟶</Text>
    </TouchableOpacity>
  </View>

  {/* background azul mais claro */}
  <View style={styles.missionsWrapper}>
    {dailyMissions.slice(0, 2).map((mission) => {
      const progressText =
        mission.target > 1
          ? `Progresso: ${mission.current}/${mission.target}`
          : undefined;

      return (
        <View key={mission.id} style={styles.missionCard}>
          <View style={styles.missionAccent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.missionText}>{mission.title}</Text>
            {progressText && (
              <Text style={styles.missionSubText}>
                {progressText}
              </Text>
            )}
          </View>

          {/* pill mais “quadrado” para XP/peça */}
          <View style={styles.missionRewardPill}>
            <Text style={styles.missionRewardText}>
              ✨ +{mission.rewardPieces}
            </Text>
            <Text style={styles.missionRewardText}>
              ⚡ +{mission.rewardXp}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
</View>

        {/* Trilhas recomendadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trilhas recomendadas</Text>

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

              return (
                <View style={styles.trackCard}>
                  <Text style={styles.trackTitle}>{item.title}</Text>
                  <Text style={styles.trackSubtitle}>
                    {trackProg}/{item.totalLessons} aulas (
                    {isNaN(percent) ? 0 : percent}%)
                  </Text>

                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('Trilhas')}
                  >
                    <Text style={styles.trackButtonText}>
                      Ir para trilha
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhuma trilha cadastrada ainda.
              </Text>
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Toast de recompensa (pode ser usado no futuro quando o sistema concluir missão) */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* ========= MODAL CENTRAL DE MISSÕES ========= */}
      <Modal
        visible={missionsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMissionsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cabeçalho */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Central de Missões</Text>
                <Text style={styles.modalSubtitle}>
                  Complete tarefas, colete peças e XP.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setMissionsModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Abas Diárias / Semanais */}
            <View style={styles.tabsRow}>
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveMissionTab('daily')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeMissionTab === 'daily' &&
                      styles.tabTextActive,
                  ]}
                >
                  Diárias
                </Text>
                {activeMissionTab === 'daily' && (
                  <View style={styles.tabUnderline} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveMissionTab('weekly')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeMissionTab === 'weekly' &&
                      styles.tabTextActive,
                  ]}
                >
                  Semanais
                </Text>
                {activeMissionTab === 'weekly' && (
                  <View style={styles.tabUnderline} />
                )}
              </TouchableOpacity>
            </View>

            {/* Lista de missões */}
            <ScrollView
              style={{ marginTop: 8 }}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              {visibleMissions.length === 0 && (
                <Text style={styles.emptyText}>
                  Nenhuma missão disponível nesta aba.
                </Text>
              )}

              {visibleMissions.map((mission) => {
                const isCompleted = mission.completed;
                const hasProgress = mission.target > 1;
                const progressText = hasProgress
                  ? `Progresso: ${mission.current}/${mission.target}`
                  : undefined;

                return (
                  <View
                    key={mission.id}
                    style={[
                      styles.modalMissionCard,
                      isCompleted
                        ? styles.modalMissionCardDone
                        : styles.modalMissionCardActive,
                    ]}
                  >
                    {/* faixa lateral de destaque */}
                    <View
                      style={[
                        styles.modalMissionAccent,
                        isCompleted && {
                          backgroundColor: '#455A64',
                        },
                      ]}
                    />

                    {/* Conteúdo */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.modalMissionTitle,
                          isCompleted && styles.modalMissionTitleDone,
                        ]}
                      >
                        {mission.title}
                      </Text>

                      {mission.description ? (
                        <Text
                          style={[
                            styles.modalMissionDesc,
                            isCompleted && styles.modalMissionDescDone,
                          ]}
                        >
                          {mission.description}
                        </Text>
                      ) : null}

                      {progressText && (
                        <Text
                          style={[
                            styles.modalMissionProgress,
                            isCompleted &&
                              styles.modalMissionProgressDone,
                          ]}
                        >
                          {progressText}
                        </Text>
                      )}
                    </View>

                    {/* Recompensa */}
                    <View style={styles.rewardBox}>
                      <Text
                        style={[
                          styles.rewardText,
                          isCompleted && styles.rewardTextDone,
                        ]}
                      >
                        ✨ +{mission.rewardPieces} peça(s)
                      </Text>
                      <Text
                        style={[
                          styles.rewardText,
                          isCompleted && styles.rewardTextDone,
                        ]}
                      >
                        ⚡ +{mission.rewardXp} XP
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // raíz para permitir toast + modal sobrepostos
  root: {
    flex: 1,
    backgroundColor: '#1C2A3A',
  },
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 4,
  },
  levelBadge: {
    backgroundColor: '#2A3B4C',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 72,
  },
  levelLabel: {
    color: '#B0BEC5',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  levelValue: {
    color: '#A3E6D5',
    fontSize: 18,
    fontWeight: '700',
  },
  levelTag: {
    color: '#D1C4E9',
    fontSize: 11,
    marginTop: 2,
  },

  xpContainer: {
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLabel: {
    color: '#B0BEC5',
    fontSize: 12,
  },
  xpValue: {
    color: '#A3E6D5',
    fontSize: 12,
    fontWeight: '600',
  },
  xpBarBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2A3B4C',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4DB6AC',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  // STREAK EM DESTAQUE
  streakCard: {
    flex: 1.2,
    backgroundColor: '#4DB6AC',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1C2A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakIcon: {
    fontSize: 20,
  },
  streakTitle: {
    color: '#0B2533',
    fontSize: 14,
    fontWeight: '700',
  },
  streakSubtitle: {
    color: '#063445',
    fontSize: 12,
  },

  profileShortcut: {
    flex: 1,
    backgroundColor: '#2A3B4C',
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
  },
  profileShortcutTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
  },
  profileShortcutSubtitle: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
  },

  section: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLink: {
    color: '#A3E6D5',
    fontSize: 12,
    fontWeight: '500',
  },

  // Missões em destaque na HOME
missionCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#2A3B4C', // azul mais escuro em cima do wrapper claro
  borderRadius: 14,
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginBottom: 8,
},

missionAccent: {
  width: 4,
  height: '100%',
  borderRadius: 999,
  backgroundColor: '#D1C4E9', // lilás de acento
  marginRight: 10,
},

missionText: {
  color: '#F5F5F5',
  fontSize: 14,
  fontWeight: '600',
},

missionSubText: {
  color: '#B0BEC5',
  fontSize: 12,
  marginTop: 2,
},
  missionRewardPill: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1C2A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionRewardText: {
    color: '#A3E6D5',
    fontSize: 11,
    fontWeight: '600',
  },

  trackCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#F5F5F5',
    fontSize: 15,
    fontWeight: '600',
  },
  trackSubtitle: {
    color: '#B0BEC5',
    fontSize: 13,
    marginTop: 4,
  },
  trackButton: {
    marginTop: 8,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4DB6AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#1C2A3A',
    fontWeight: '600',
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 13,
  },

  // Toast
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#263238',
    borderRadius: 16,
  },
  toastText: {
    color: '#F5F5F5',
    fontSize: 13,
    textAlign: 'center',
  },

  // Modal de missões
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#2A3B4C',
    padding: 16,
    maxHeight: '65%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  modalCloseText: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '700',
  },

  tabsRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#B0BEC5',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#F5F5F5',
  },
  tabUnderline: {
    marginTop: 4,
    height: 3,
    width: 40,
    borderRadius: 999,
    backgroundColor: '#4DB6AC',
  },

  modalMissionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 18,
    marginBottom: 10,
  },
  modalMissionCardActive: {
    backgroundColor: '#1C2A3A',
  },
  modalMissionCardDone: {
    backgroundColor: '#263238',
  },
  modalMissionAccent: {
    width: 4,
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4DB6AC',
    marginRight: 10,
  },
  modalMissionTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '600',
  },
  modalMissionTitleDone: {
    color: '#B0BEC5',
    textDecorationLine: 'line-through',
  },
  modalMissionDesc: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
  },
  modalMissionDescDone: {
    color: '#90A4AE',
    textDecorationLine: 'line-through',
  },
  modalMissionProgress: {
    color: '#A3E6D5',
    fontSize: 12,
    marginTop: 4,
  },
  modalMissionProgressDone: {
    color: '#78909C',
    textDecorationLine: 'line-through',
  },
  rewardBox: {
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rewardText: {
    color: '#D1C4E9',
    fontSize: 11,
  },
  rewardTextDone: {
    color: '#B0BEC5',
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  missionsWrapper: {
  backgroundColor: '#4db6ac80', // azul mais claro que o fundo principal
  borderRadius: 18,
  paddingHorizontal: 8,
  paddingVertical: 10,
},
});

export default HomeScreen;
