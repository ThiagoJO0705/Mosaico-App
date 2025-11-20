// src/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import Logo from "../../assets/logo.png";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { UserData } from "../context/UserContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

// Helpers simples de validação
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isStrongPassword = (password: string) => password.length >= 6;
const onlyDigits = (value: string) => value.replace(/\D/g, "");
const isValidCPF = (cpf: string) => /^\d{11}$/.test(cpf); // 11 dígitos

const RegisterScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");   // 🔹 NOVO
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNextStep = async () => {
    // 🔎 Validações por etapa
    if (step === 1) {
      const trimmedName = name.trim();
      if (trimmedName.length < 3) {
        Alert.alert('Nome inválido', 'Por favor, insira seu nome completo (mínimo 3 caracteres).');
        return;
      }
    }

    if (step === 2) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!isValidEmail(trimmedEmail)) {
        Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido (ex: nome@dominio.com).');
        return;
      }
    }

    if (step === 3) {
      if (!isStrongPassword(password)) {
        Alert.alert(
          'Senha fraca',
          'Sua senha deve ter no mínimo 6 caracteres.'
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert(
          'Senhas diferentes',
          'A confirmação de senha não confere. Digite a mesma senha nos dois campos.'
        );
        return;
      }
    }

    if (step === 4) {
      const cleanedCpf = onlyDigits(cpf);
      if (!isValidCPF(cleanedCpf)) {
        Alert.alert(
          'CPF inválido',
          'Digite um CPF válido com 11 números (somente dígitos).'
        );
        return;
      }
    }

    // Se ainda não chegou na última etapa, só avança
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      return;
    }

    // Etapa 4 (final) → efetiva o cadastro
    setLoading(true);
    try {
      const cleanedCpf = onlyDigits(cpf);
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const firebaseUser = userCredential.user;

      // 2. Dados iniciais do usuário no Firestore
      const newUserDoc: Omit<UserData, 'uid'> = {
        name: trimmedName,
        email: trimmedEmail,
        cpf: cleanedCpf,
        level: 1,
        xp: 0,
        streakDays: 0,
        interests: [], // Começa com interesses vazios
        recommendedTrackIds: [],
        trackProgress: {},
        currentMosaicIndex: 1,
        currentMosaicPieces: 0,
        currentMosaicHistory: [],
        mosaicBadges: [],
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUserDoc);

      // Aqui você ainda manda para a Interests do AuthStack.
      // (Se depois quiser, podemos tirar isso e deixar o App/RootNavigator cuidar.)
      navigation.replace("Interests", {
        form: { name: trimmedName, email: trimmedEmail, password, cpf: cleanedCpf },
      });

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este e-mail já está em uso. Tente fazer login.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      } else {
        Alert.alert('Erro no cadastro', 'Ocorreu um erro inesperado.');
        console.error("Erro de cadastro no Firebase:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderField = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.fieldLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Como você gosta de ser chamado?"
              placeholderTextColor="#78909C"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              onSubmitEditing={handleNextStep}
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#78909C"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              onSubmitEditing={handleNextStep}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.fieldLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha segura (mín. 6 caracteres)"
              placeholderTextColor="#78909C"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="next"
              onSubmitEditing={handleNextStep}
            />

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
              Confirmar senha
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a mesma senha novamente"
              placeholderTextColor="#78909C"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleNextStep}
            />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.fieldLabel}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu CPF (apenas números)"
              placeholderTextColor="#78909C"
              keyboardType="numeric"
              value={cpf}
              onChangeText={(text) => setCpf(onlyDigits(text))} // 🔹 só números
              returnKeyType="done"
              onSubmitEditing={handleNextStep}
              maxLength={11}
            />
          </>
        );
      default:
        return null;
    }
  };

  const stepTitle = () => {
    switch (step) {
      case 1:
        return "Vamos começar pelo seu nome";
      case 2:
        return "Agora seu e-mail de acesso";
      case 3:
        return "Defina e confirme sua senha";
      case 4:
        return "Só mais um dado: seu CPF";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.logoBlock}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.appName}>MOSAICO</Text>
          <Text style={styles.logoSubtitle}>
            Crie sua conta para começar a montar seu futuro.
          </Text>
        </View>

        <View style={styles.formBlock}>
          <Text style={styles.stepIndicator}>Etapa {step}/4</Text>
          <Text style={styles.stepTitle}>{stepTitle()}</Text>

          <View style={{ marginTop: 16 }}>{renderField()}</View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleNextStep}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1C2A3A" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {step < 4 ? "Continuar" : "Concluir e ir para interesses"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>
              Já tem conta? Fazer login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2A3A",
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  appName: {
    color: "#F5F5F5",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 8,
  },
  logoSubtitle: {
    color: "#B0BEC5",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  formBlock: {
    width: "100%",
    marginTop: 8,
  },
  stepIndicator: {
    color: "#B0BEC5",
    fontSize: 12,
  },
  stepTitle: {
    color: "#F5F5F5",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  fieldLabel: {
    color: "#F5F5F5",
    fontSize: 13,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#2A3B4C",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#F5F5F5",
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: "#4DB6AC",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: '#3E8A81',
  },
  primaryButtonText: {
    color: "#1C2A3A",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#B0BEC5",
    fontSize: 13,
  },
});

export default RegisterScreen;
