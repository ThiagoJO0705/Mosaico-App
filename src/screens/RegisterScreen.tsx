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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import Logo from "../../assets/logo.png";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");

  const nextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      return;
    }

    navigation.replace("Interests", {
      form: {
        name,
        email,
        password,
        cpf,
      },
    });
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
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.fieldLabel}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha segura"
              placeholderTextColor="#78909C"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.fieldLabel}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu CPF"
              placeholderTextColor="#78909C"
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
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
        return "Defina uma senha segura";
      case 4:
        return "Só mais um dado: seu CPF";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        {/* LOGO + TEXTO */}
        <View style={styles.logoBlock}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.appName}>MOSAICO</Text>
          <Text style={styles.logoSubtitle}>
            Crie sua conta para começar a montar seu futuro.
          </Text>
        </View>

        {/* FORM EM ETAPAS */}
        <View style={styles.formBlock}>
          <Text style={styles.stepIndicator}>Etapa {step}/4</Text>
          <Text style={styles.stepTitle}>{stepTitle()}</Text>

          <View style={{ marginTop: 16 }}>{renderField()}</View>

          <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
            <Text style={styles.primaryButtonText}>
              {step < 4 ? "Continuar" : "Concluir cadastro"}
            </Text>
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2A3A",
  },

  // 🔥 tudo centralizado na tela
  inner: {
    flex: 1,
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

  // form ocupa 100% da largura, mas fica no centro junto com a logo
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
  primaryButtonText: {
    color: "#1C2A3A",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#B0BEC5",
    fontSize: 13,
  },
});

export default RegisterScreen;
