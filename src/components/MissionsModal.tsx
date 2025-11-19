// src/components/MissionsModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type Mission = {
  id: string;
  title: string;
  rewardPieces: number;
  rewardXp: number;
  completed?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
};

const MissionsModal: React.FC<Props> = ({
  visible,
  onClose,
  dailyMissions,
  weeklyMissions,
}) => {
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  const currentList = tab === 'daily' ? dailyMissions : weeklyMissions;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Central de Missões</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={18} color="#F5F5F5" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setTab('daily')}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'daily' && styles.tabTextActive,
                ]}
              >
                Diárias
              </Text>
              {tab === 'daily' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setTab('weekly')}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'weekly' && styles.tabTextActive,
                ]}
              >
                Semanais
              </Text>
              {tab === 'weekly' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* Lista de missões */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {currentList.length === 0 && (
              <Text style={styles.emptyText}>
                Nenhuma missão disponível por enquanto.
              </Text>
            )}

            {currentList.map((mission) => {
              const isDone = !!mission.completed;

              return (
                <View
                  key={mission.id}
                  style={[
                    styles.missionCard,
                    isDone && styles.missionCardCompleted,
                  ]}
                >
                  <View style={styles.missionInfo}>
                    <Text
                      style={[
                        styles.missionTitle,
                        isDone && styles.missionTitleCompleted,
                      ]}
                    >
                      {mission.title}
                    </Text>
                    <Text
                      style={[
                        styles.missionStatus,
                        isDone && styles.missionStatusCompleted,
                      ]}
                    >
                      {isDone ? 'Concluída' : 'Em andamento'}
                    </Text>
                  </View>

                  <View style={styles.rewardsBlock}>
                    <View style={styles.rewardPill}>
                      <Text style={styles.rewardEmoji}>✨</Text>
                      <Text style={styles.rewardText}>
                        +{mission.rewardPieces}
                      </Text>
                    </View>
                    <View style={styles.rewardPill}>
                      <Text style={styles.rewardEmoji}>⚡</Text>
                      <Text style={styles.rewardText}>
                        +{mission.rewardXp}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 12, 24, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '60%',
    backgroundColor: '#2A3B4C',
    borderRadius: 24,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1C2A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#F5F5F5',
    fontWeight: '600',
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    width: 40,
    borderRadius: 1,
    backgroundColor: '#4DB6AC',
  },
  list: {
    marginTop: 8,
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },
  missionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C2A3A',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  missionCardCompleted: {
    opacity: 0.6,
  },
  missionInfo: {
    flex: 1,
    marginRight: 12,
  },
  missionTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: '500',
  },
  missionTitleCompleted: {
    color: '#B0BEC5',
    textDecorationLine: 'line-through',
  },
  missionStatus: {
    color: '#A3E6D5',
    fontSize: 12,
    marginTop: 2,
  },
  missionStatusCompleted: {
    color: '#B0BEC5',
  },
  rewardsBlock: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 4,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3B4C',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  rewardText: {
    color: '#F5F5F5',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MissionsModal;
