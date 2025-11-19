// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from './TabsNavigator';
import MosaicScreen from '../screens/MosaicScreen';
import TrackDetailScreen from '../screens/TrackDetailScreen';
import InterestsScreen from '../screens/InterestsScreen';

export type RootStackParamList = {
  Tabs: undefined;
  Mosaic: undefined;
  TrackDetail: { trackId: string };
  Interests: { editMode: true };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="Mosaic" component={MosaicScreen} />
      <Stack.Screen name="TrackDetail" component={TrackDetailScreen} />
      <Stack.Screen
        name="Interests"
        component={InterestsScreen}
        options={{
          headerShown: true,
          title: 'Editar Interesses',
          headerStyle: { backgroundColor: '#1C2A3A' },
          headerTintColor: '#F5F5FF',
          // MODIFICAÇÃO: Linha inválida removida
          // headerBackTitleVisible: false, 
        }}
      />
    </Stack.Navigator>
  );
}