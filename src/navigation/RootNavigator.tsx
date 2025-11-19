
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from './TabsNavigator';
import MosaicScreen from '../screens/MosaicScreen';
import TrackDetailScreen from '../screens/TrackDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  Mosaic: undefined;
  TrackDetail: { trackId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* MENU PRINCIPAL (tabs) */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />

      {/* TELAS FULLSCREEN */}
      <Stack.Screen name="Mosaic" component={MosaicScreen} />
      <Stack.Screen name="TrackDetail" component={TrackDetailScreen} />
    </Stack.Navigator>
  );
}