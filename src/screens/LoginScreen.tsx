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

// Importando SVGs como componentes
import FundoSvg from "../../assets/images/FUNDO.svg";
import GroupSvg from "../../assets/images/Group.svg";

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
  setError("");
  setLoading(true);

  if (!cpf || !senha) {
    setError("Preencha todos os campos.");
    setLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("cpf", cpf);
    formData.append("senha", senha);

    const response = await fetch(
      "https://caapi.org.br/appcaapi/api/logarAdvogado",
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      throw new Error("Erro de conexão com servidor");
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    if (data?.ok === "Usuario logado!") {
      setUsuario(data.usuario);

      // 🔹 Aqui você vai decidir com base nos dados que a API devolver
      if (data.usuario?.cadastro_validado) {
        navigation.replace("Home");
      } else if (data.usuario?.aguardando_validacao) {
        navigation.replace("CadastroValidacao");
      } else {
        navigation.replace("EscolhaTipo"); // começa fluxo de cadastro
      }

    } else {
      setError("CPF ou OAB inválidos.");
    }
  } catch (err) {
    console.error(err);
    setError("Erro ao conectar com o servidor.");
  } finally {
    setLoading(false);
  }
};



  return (
    <View style={styles.background}>
      {/* Fundo como SVG */}
      <FundoSvg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={styles.svgBackground}
      />

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
            <Text style={styles.label}>Número OAB</Text>
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
            <Text style={styles.buttonText}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("EscolhaTipo")}>
            <Text style={styles.link}>
              Não tem conta? Cadastre-se aqui
            </Text>
          </TouchableOpacity>
        </FormContainer>

        {/* Rodapé */}
        <View style={styles.footer}>
          <GroupSvg
            width="100%"
            height={100}
            preserveAspectRatio="xMidYMid slice"
          />
        </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
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
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});