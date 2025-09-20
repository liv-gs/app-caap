import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AppText from "../components/AppText";
import { useAuth } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getHash, getUsuarioLogado } from "../api/api";

const API_BASE_URL = "https://caapi.org.br/appcaapi/api/";

export default function EditarDados() {
  const { usuario, setUsuario } = useAuth();
  const navigation = useNavigation();

  const [nome, setNome] = useState(usuario?.nomeLogado || "");
  const [dataNascimento, setDataNascimento] = useState(usuario?.dataNascimento || "");
  const [celular, setCelular] = useState(usuario?.celular || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [cep, setCep] = useState(usuario?.endereco?.cep || "");
  const [cidade, setCidade] = useState(usuario?.endereco?.idMunicipio || 0);
  const [bairro, setBairro] = useState(usuario?.endereco?.bairro || "");
  const [logradouro, setLogradouro] = useState(usuario?.endereco?.logradouro || "");
  const [numero, setNumero] = useState(usuario?.endereco?.numero || "");
  const [complemento, setComplemento] = useState(usuario?.endereco?.complemento || "");
  const [senha, setSenha] = useState("");

  const [hash, setHash] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
 const formatDateForApi = (date: string) => {
  const parts = date.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${day}/${month}/${year}`;
  }
  return date; // devolve como está, evita crash
};

  useEffect(() => {
    const carregarSessao = async () => {
      const savedHash = await getHash();
      const savedUser = await getUsuarioLogado();
      setHash(savedHash);
      if (savedUser) setIdUsuario(savedUser.idUsuarioLogado);
    };
    carregarSessao();
  }, []);

  async function handleSalvar() {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e e-mail são obrigatórios.");
      return;
    }

    if (!hash || !idUsuario) {
      Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("dataNascimento", formatDateForApi(dataNascimento)); // ✅ certo


      formData.append("celular", celular);
      formData.append("email", email);
      formData.append("cep", cep);
      formData.append("cidade", String(cidade));
      formData.append("bairro", bairro);
      formData.append("logradouro", logradouro);
      formData.append("numero", numero);
      formData.append("complemento", complemento);
      if (senha) formData.append("senha", senha);

      console.log("📤 Enviando FormData para API...");
      for (const [key, value] of (formData as any).entries()) {
        console.log(key, value);
      }

      const res = await fetch(`${API_BASE_URL}alterarCadastro`, {
        method: "POST",
        headers: {
          hash,
          idUsuarioLogado: idUsuario.toString(),
          // não defina Content-Type, o fetch faz sozinho para FormData
        },
        body: formData,
      });

      console.log("Status:", res.status);
      console.log("URL:", res.url);

      const contentType = res.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log("📥 Resposta (texto/HTML):", text);
        data = { ok: res.ok, raw: text };
      }


      if (data.ok) {
        Alert.alert("Sucesso", "Dados atualizados com sucesso!");
        // Atualiza contexto do usuário
        setUsuario({
          ...usuario,
          nomeLogado: nome,
          dataNascimento: formatDateForApi(dataNascimento),
          celular,
          email,
          endereco: {
            ...usuario?.endereco,
            cep,
            idMunicipio: cidade,
            bairro,
            logradouro,
            numero,
            complemento,
          },
        });
      } else {
        Alert.alert("Erro", data.erro || "Não foi possível atualizar os dados.");
      }
    } catch (err: any) {
      console.log("❌ Erro inesperado:", err);
      Alert.alert("Erro", err.message || "Erro inesperado.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <AppText style={styles.label}>Nome</AppText>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <AppText style={styles.label}>Data de Nascimento</AppText>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
        placeholder="dd/mm/aaaa"
      />

      <AppText style={styles.label}>Celular</AppText>
      <TextInput
        style={styles.input}
        value={celular}
        onChangeText={setCelular}
        placeholder="(86) 99999-9999"
      />

      <AppText style={styles.label}>E-mail</AppText>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <AppText style={styles.label}>CEP</AppText>
      <TextInput style={styles.input} value={cep} onChangeText={setCep} />

      <AppText style={styles.label}>Cidade (ID)</AppText>
      <TextInput
        style={styles.input}
        value={cidade.toString()}
        onChangeText={(text) => setCidade(Number(text))}
        keyboardType="numeric"
      />

      <AppText style={styles.label}>Bairro</AppText>
      <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

      <AppText style={styles.label}>Logradouro</AppText>
      <TextInput style={styles.input} value={logradouro} onChangeText={setLogradouro} />

      <AppText style={styles.label}>Número</AppText>
      <TextInput style={styles.input} value={numero} onChangeText={setNumero} />

      <AppText style={styles.label}>Complemento</AppText>
      <TextInput style={styles.input} value={complemento} onChangeText={setComplemento} />

      <AppText style={styles.label}>Nova Senha</AppText>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Feather name="save" size={20} color="#fff" />
        <AppText style={styles.buttonText}>Salvar</AppText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10, fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#0066cc",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", marginLeft: 10, fontWeight: "bold" },
});
