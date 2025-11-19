// src/screens/RegisterScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const totalSteps = 4;

  const canGoNext = useMemo(() => {
    if (step === 0) return name.trim().length > 2;
    if (step === 1) return email.trim().includes('@');
    if (step === 2) return cpf.trim().length >= 11; // bem simples
    if (step === 3) return password.trim().length >= 4;
    return false;
  }, [step, name, email, cpf, password]);

  const handleNext = () => {
    if (!canGoNext) return;

    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    // Último passo → vai para a tela de interesses
    navigation.navigate('Interests', {
      form: {
        name: name.trim(),
        email: email.trim(),
        cpf: cpf.trim(),
        password: password.trim(),
      },
    });
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const renderStepLabel = () => {
    switch (step) {
      case 0:
        return 'Qual é o seu nome?';
      case 1:
        return 'Qual é o seu e-mail?';
      case 2:
        return 'Qual é o seu CPF?';
      case 3:
        return 'Crie uma senha segura';
      default:
        return '';
    }
  };

  const renderPlaceholder = () => {
    switch (step) {
      case 0:
        return 'Digite seu nome completo';
      case 1:
        return 'exemplo@email.com';
      case 2:
        return 'Somente números';
      case 3:
        return 'Mínimo de 4 caracteres';
      default:
        return '';
    }
  };

  const renderKeyboardType = () => {
    switch (step) {
      case 1:
        return 'email-address';
      case 2:
        return 'numeric';
      default:
        return 'default';
    }
  };

  const isSecure = step === 3;

  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Cabeçalho básico com "voltar" */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>MOSÁICO</Text>

        <View style={{ width: 60 }} />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Criar sua conta</Text>
        <Text style={styles.subtitle}>
          Passo {step + 1} de {totalSteps}
        </Text>

        {/* Barrinha de progresso */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.stepLabel}>{renderStepLabel()}</Text>

          <TextInput
            style={styles.input}
            placeholder={renderPlaceholder()}
            placeholderTextColor="#78909C"
            keyboardType={renderKeyboardType() as any}
            secureTextEntry={isSecure}
            autoCapitalize={step === 0 ? 'words' : 'none'}
            value={
              step === 0 ? name : step === 1 ? email : step === 2 ? cpf : password
            }
            onChangeText={(text) => {
              if (step === 0) setName(text);
              else if (step === 1) setEmail(text);
              else if (step === 2) setCpf(text);
              else setPassword(text);
            }}
          />

          <TouchableOpacity
            style={[
              styles.primaryButton,
              !canGoNext && styles.primaryButtonDisabled,
            ]}
            onPress={handleNext}
            activeOpacity={canGoNext ? 0.8 : 1}
          >
            <Text style={styles.primaryButtonText}>
              {step === totalSteps - 1 ? 'Continuar' : 'Próximo'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>
          Seus dados serão usados para personalizar sua jornada e montar
          seu MOSAICO de habilidades.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2A3A', // fundo principal azul marinho
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  brand: {
    color: '#F5F5F5',
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 4,
  },
  progressBarBackground: {
    marginTop: 16,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#2A3B4C',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#4DB6AC',
  },
  card: {
    marginTop: 24,
    backgroundColor: '#2A3B4C', // superfície
    borderRadius: 20,
    padding: 16,
  },
  stepLabel: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderRadius: 14,
    backgroundColor: '#1C2A3A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F5F5F5',
    fontSize: 15,
    marginBottom: 16,
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: '#4DB6AC',
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#1C2A3A',
    fontSize: 15,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 16,
    color: '#B0BEC5',
    fontSize: 12,
  },
});

export default RegisterScreen;
