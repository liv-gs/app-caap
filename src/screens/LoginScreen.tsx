import React, { useState, ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/index";
import { useAuth } from "../context/AuthContext";
import { loginAdvogado } from "../api/api";
// Importando SVGs como componentes
import FundoSvg from "../../assets/images/FUNDO.svg";
import GroupSvg from "../../assets/images/Group.svg";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

import LogoSvg  from "../../assets/images/Camada_1.svg";
type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

function FormContainer({ children }: { children: ReactNode }) {
  return <View style={styles.formContainer}>{children}</View>;
}

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenProp>();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUsuario } = useAuth();

const handleLogin = async () => {
  setLoading(true);
  try {
    const data = await loginAdvogado(cpf, senha);
 console.log("🔹 Dados retornados da API:", data);
    console.log("🔹 Usuario retornado:", data?.usuario);
    console.log("🔹 Endereço:", data?.usuario?.endereco);
    if (!data?.usuario) {
      setError("CPF ou Senha inválidos.");
      return;
    }

    // Salva no contexto
    setUsuario(data.usuario);

    // Verifica se o usuário foi validado
    if (data.usuario.validado === 0) {
      navigation.reset({
        index: 0,
        routes: [{ name: "CadastroValidacao" }],
      });
    } else if (data.usuario.validado === 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      setError("Status do usuário desconhecido.");
    }
  } catch (err) {
    setError("Erro ao conectar com o servidor.");
  } finally {
    setLoading(false);
  }
};




return (
  <View style={styles.background}>
    {/* Fundo SVG */}
    <FundoSvg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={styles.svgBackground}
    />

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrapper}>
          <LogoSvg width={200} height={120} preserveAspectRatio="xMidYMid meet" />
        </View>
        

        <View style={styles.container}>
          <FormContainer>
            <Text style={styles.title}>Acesse sua conta</Text>

          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {/* CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </View>

          {/* Senha (Número OAB) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="12345"
            />
          </View>

         <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
            <ActivityIndicator color="#fff" /> 
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("EscolhaTipo")}>
            <Text style={styles.link}>
              Não tem conta? Cadastre-se aqui
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("RecuperarSenha")}>
            <Text style={styles.link}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>
          </FormContainer>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <GroupSvg
            width="100%"
            height={120}
            preserveAspectRatio="xMidYMid slice"
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.91)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  errorBanner: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    textAlign: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 48,
    borderColor: "#646464ff",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#e2e2e2d2",
    color:"#000000ff"
  },
  button: {
    height: 48,
    backgroundColor: "#CF1920",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#1E40AF",
    textAlign: "center",
    padding:10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "120%",
  },
  logoWrapper: {
  alignItems: "center",
  marginTop: 80,  // distância do topo da tela
},

  logo: {
    width: 120, // largura da logo
    height: 80, // altura da logo
  },
});