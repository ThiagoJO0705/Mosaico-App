// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from './TabsNavigator';
import MosaicScreen from '../screens/MosaicScreen';
import TrackDetailScreen from '../screens/TrackDetailScreen';
import InterestsScreen from '../screens/InterestsScreen';
import { useUser } from '../context/UserContext';
import PublicProfileScreen from '../screens/PublicProfileScreen';

export type RootStackParamList = {
  Tabs: undefined;
  Mosaic: undefined;
  TrackDetail: { trackId: string };
  Interests: { editMode?: boolean } | undefined;
  PublicProfile: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user } = useUser();

  const isNewUserOnboarding =
    user && (!user.interests || user.interests.length === 0);

  const initialRouteName: keyof RootStackParamList = isNewUserOnboarding
    ? 'Interests'
    : 'Tabs';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="Mosaic" component={MosaicScreen} />
      <Stack.Screen name="TrackDetail" component={TrackDetailScreen} />
      <Stack.Screen
        name="Interests"
        component={InterestsScreen}
        options={{
          headerShown: true,
          title: isNewUserOnboarding ? 'Quais são seus interesses?' : 'Editar Interesses',
          headerStyle: { backgroundColor: '#1C2A3A' },
          headerTintColor: '#F5F5FF',
        }}
      />
            <Stack.Screen
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{
          headerShown: true,
          title: 'Perfil Público',
          headerStyle: { backgroundColor: '#1C2A3A' },
          headerTintColor: '#F5F5FF',
        }}
      />
    </Stack.Navigator>
  );
}
