import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
