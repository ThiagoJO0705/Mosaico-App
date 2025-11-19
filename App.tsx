// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/context/UserContext';

import AuthStackNavigator from './src/navigation/AuthStack';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        {/* 👇 agora o fluxo começa no stack de autenticação */}
        <AuthStackNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
