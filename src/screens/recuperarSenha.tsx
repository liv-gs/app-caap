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


const API_URL = "https://caapi.org.br/appcaapi/api/";
const RecuperarSenha = () => {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

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
      setCpf(""); // limpa campo
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>

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
  );
};

export default RecuperarSenha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
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
