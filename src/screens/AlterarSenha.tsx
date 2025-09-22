import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getHash, getUsuarioLogado } from "../api/api"; // mesmo que na Carteirinha

const API_BASE_URL = "https://caapi.org.br/appcaapi/api/";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // carrega hash e idUsuarioLogado igual Carteirinha
  useEffect(() => {
    const carregarSessao = async () => {
      const savedHash = await getHash();
      const savedUser = await getUsuarioLogado();
      if (savedHash) setHash(savedHash);
      if (savedUser) setIdUsuario(savedUser.idUsuarioLogado);
    };
    carregarSessao();
  }, []);

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (!hash || !idUsuario) {
      Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}alterarSenha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          hash: hash,
          idUsuarioLogado: idUsuario.toString(),
        },
        body: new URLSearchParams({
          senhaAtual: senhaAtual,
          senha: novaSenha,
        }).toString(),
      });

      const data = await response.json();
      console.log("Resposta alterarSenha:", data);

      if (data.ok) {
        Alert.alert("Sucesso", "Senha alterada com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
      } else {
        Alert.alert("Erro", data.erro || "Não foi possível alterar a senha.");
      }
    } catch (err: any) {
      console.error("Erro alterar senha:", err?.message);
      Alert.alert("Erro", "Falha ao alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        secureTextEntry
        value={senhaAtual}
        onChangeText={setSenhaAtual}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleAlterarSenha}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop:150, },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
