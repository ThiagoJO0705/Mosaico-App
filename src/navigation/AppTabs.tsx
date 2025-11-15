import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TracksListScreen from '../screens/TracksListScreen';
import AIRecommendScreen from '../screens/AIRecommendScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AppTabsParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<AppTabsParamList>();

const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Tracks" component={TracksListScreen} options={{ title: 'Trilhas' }} />
      <Tab.Screen name="AI" component={AIRecommendScreen} options={{ title: 'IA' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};

export default AppTabs;
