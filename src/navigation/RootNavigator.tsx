import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from './TabsNavigator';
import MosaicScreen from '../screens/MosaicScreen';

export type RootStackParamList = {
  Tabs: undefined;
  Mosaic: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* MENU */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />

      {/* TELA FULLSCREEN */}
      <Stack.Screen name="Mosaic" component={MosaicScreen} />
    </Stack.Navigator>
  );
}
