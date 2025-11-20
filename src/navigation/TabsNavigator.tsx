// src/navigation/TabsNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TracksScreen from '../screens/TracksListScreen';
import RankingScreen from '../screens/RankingScreen'; // 1. IMPORTE A NOVA TELA
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2A3B4C',
          borderTopColor: '#1C2A3A',
        },
        tabBarActiveTintColor: '#4DB6AC',
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Trilhas') iconName = 'trail-sign-outline';
          // 2. ADICIONE O ÍCONE PARA A NOVA ABA
          if (route.name === 'Ranking') iconName = 'trophy-outline';
          if (route.name === 'Perfil') iconName = 'person-circle-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trilhas" component={TracksScreen} />
      {/* 3. ADICIONE A NOVA TELA AO NAVEGADOR DE ABAS */}
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}