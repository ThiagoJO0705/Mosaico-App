// src/navigation/AuthStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import InterestsScreen from '../screens/InterestsScreen';

// 👉 esse é o stack que já existe, com Tabs + Mosaic
import RootNavigator from './RootNavigator';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Interests: {
    form: {
      name: string;
      email: string;
      cpf: string;
      password: string;
    };
  };
  AppRoot: undefined; // RootNavigator (Tabs + Mosaic)
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* tela inicial */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* login */}
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* registro multi-etapas */}
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* seleção de interesses depois do registro */}
      <Stack.Screen name="Interests" component={InterestsScreen} />

      {/* app principal (seu RootNavigator com Tabs + Mosaic) */}
      <Stack.Screen name="AppRoot" component={RootNavigator} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
