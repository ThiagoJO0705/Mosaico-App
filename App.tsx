// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider, useUser } from './src/context/UserContext';
import AuthStackNavigator from './src/navigation/AuthStack';
import RootNavigator from './src/navigation/RootNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const AppContent: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <RootNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};


export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2A3A',
  },
});