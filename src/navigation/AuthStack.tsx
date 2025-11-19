// src/navigation/AuthStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import InterestsScreen from '../screens/InterestsScreen';
import RootNavigator from './RootNavigator';
import TabsNavigator from './TabsNavigator';

// Garante que este tipo seja exportado
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
  AppRoot: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* Nenhuma mudança aqui, já estava correto */}
      <Stack.Screen name="Interests" component={InterestsScreen} />
      <Stack.Screen name="AppRoot" component={RootNavigator} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;