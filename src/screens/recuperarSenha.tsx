import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FundoSvg from "../../assets/images/FUNDO.svg";
import { Ionicons } from "@expo/vector-icons"; 

const API_URL = "https://appcaapi.caapi.org.br/api";

const RecuperarSenha = () => {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleRecuperarSenha = async () => {
    if (!cpf.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu CPF.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/recuperarSenha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.error || "Não foi possível recuperar a senha.");
        return;
      }

      Alert.alert("Sucesso", data.message || "Nova senha enviada por e-mail!");
      setCpf("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fundo SVG */}
      <FundoSvg
        width="100%"
        height="100%"
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar Senha</Text>

        {/* Espaço para centralizar o título */}
        <View style={{ width: 28 }} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRecuperarSenha}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Recuperar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecuperarSenha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EFEFEF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E40AF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
