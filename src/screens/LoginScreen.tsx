// src/screens/LoginScreen.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  ScrollView,
  Alert, // Importa o Alert
  ActivityIndicator, // Importa o ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack'; // Ajuste o caminho se necessário
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa a função de login
import { auth } from '../services/firebaseConfig'; // Importa a instância do auth

const Logo = require('../../assets/logo.png');

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Adiciona estado de loading

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    // Validação básica
    if (!email || !password) {
      Alert.alert("Campos vazios", "Por favor, preencha seu e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      // Tenta fazer o login com o Firebase Authentication
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // SUCESSO! Não fazemos mais nada aqui.
      // O listener onAuthStateChanged no UserContext vai cuidar da navegação.
    } catch (error: any) {
      // Trata os erros mais comuns de login
      console.error("Erro de login no Firebase:", error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        Alert.alert("Erro de Login", "E-mail ou senha incorretos. Por favor, tente novamente.");
      } else {
        Alert.alert("Erro de Login", "Ocorreu um erro inesperado. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.appName}>MOSAICO</Text>
          <Text style={styles.logoSubtitle}>
            Construa seu futuro peça por peça
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#78909C"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#78909C"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1C2A3A" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Ainda não tem conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}> Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  appName: {
    color: '#F5F5F5',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 12,
  },
  logoSubtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 28,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    color: '#F5F5F5',
    marginLeft: 4,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#2A3B4C',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#F5F5F5',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#4DB6AC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#3E8A81',
  },
  buttonText: {
    color: '#1C2A3A',
    fontWeight: '700',
    fontSize: 15,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#B0BEC5',
  },
  footerLink: {
    color: '#4DB6AC',
    fontWeight: '600',
  },
});

export default LoginScreen;