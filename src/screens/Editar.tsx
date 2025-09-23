import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AppText from "../components/AppText";
import { useAuth } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import { getHash, getUsuarioLogado } from "../api/api";

const API_BASE_URL = "https://caapi.org.br/appcaapi/api/";

// Formatação de datas
const formatDateForInput = (date: string) => {
  if (!date) return "";
  const [ano, mes, dia] = date.split("-");
  return `${dia}/${mes}/${ano}`;
};

const formatDateInput = (text: string) => {
  let cleaned = text.replace(/\D/g, "");
  cleaned = cleaned.substring(0, 8);
  if (cleaned.length >= 5)
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
  if (cleaned.length >= 3) return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
  return cleaned;
};

export default function EditarDados() {
  const { usuario, setUsuario } = useAuth();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [senha, setSenha] = useState("");

  const [hash, setHash] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  // UFs e cidades
  const [ufs, setUfs] = useState<{ id: string; nome: string; sigla: string }[]>([]);
  const [cidades, setCidades] = useState<{ id: string; nome: string }[]>([]);
  const [estadoFiltrado, setEstadoFiltrado] = useState<string[]>([]);
  const [cidadeFiltrada, setCidadeFiltrada] = useState<string[]>([]);

  // Carregar hash e usuário logado
  useEffect(() => {
    const carregarSessao = async () => {
      const savedHash = await getHash();
      const savedUser = await getUsuarioLogado();
      setHash(savedHash);
      if (savedUser) setIdUsuario(savedUser.idUsuarioLogado);
    };
    carregarSessao();
  }, []);

  // Sincronizar campos do formulário quando usuario mudar
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nomeLogado || "");
      setDataNascimento(usuario.dataNascimento ? formatDateForInput(usuario.dataNascimento) : "");
      setCelular(usuario.celular || "");
      setEmail(usuario.email || "");
      setCep(usuario.endereco?.cep || "");
      setEstado(usuario.endereco?.uf || "");
      setCidade(usuario.endereco?.cidade || "");

      setBairro(usuario.endereco?.bairro || "");
      setLogradouro(usuario.endereco?.logradouro || "");
      setNumero(usuario.endereco?.numero || "");
      setComplemento(usuario.endereco?.complemento || "");
    }
  }, [usuario]);

  // Carregar UFs
  useEffect(() => {
    const carregarUfs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}listarUfs`, { method: "POST" });
        const data = await res.json();
        if (data.ufs) setUfs(data.ufs);
      } catch (err) {
        console.log("Erro ao carregar UFs:", err);
      }
    };
    carregarUfs();
  }, []);

  // Filtrar estados
  useEffect(() => {
    if (!estado) setEstadoFiltrado([]);
    else {
      const filtro = ufs.map((e) => e.nome).filter((e) => e.toLowerCase().includes(estado.toLowerCase()));
      setEstadoFiltrado(filtro);
    }
  }, [estado, ufs]);

  // Carregar cidades ao mudar estado
  useEffect(() => {
    const carregarCidades = async () => {
      if (!estado) return;
      try {
        const ufSelecionada = ufs.find((u) => u.nome === estado)?.sigla;
        if (!ufSelecionada) return;

        const res = await fetch(`${API_BASE_URL}listarCidades`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ uf: ufSelecionada }),
        });
        const data = await res.json();
        if (data.cidades) setCidades(data.cidades);
      } catch (err) {
        console.log("Erro ao carregar cidades:", err);
      }
    };
    carregarCidades();
  }, [estado, ufs]);

  // Filtrar cidades
  useEffect(() => {
    if (!cidade) setCidadeFiltrada([]);
    else {
      const filtro = cidades.map((c) => c.nome).filter((c) => c.toLowerCase().includes(cidade.toLowerCase()));
      setCidadeFiltrada(filtro);
    }
  }, [cidade, cidades]);

  // Salvar alterações
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
      formData.append("dataNascimento", dataNascimento);
      formData.append("celular", celular);
      formData.append("email", email);
      formData.append("cep", cep);
      formData.append("estado", estado);
      formData.append("cidade", cidade);
      formData.append("bairro", bairro);
      formData.append("logradouro", logradouro);
      formData.append("numero", numero);
      formData.append("complemento", complemento);
      if (senha) formData.append("senha", senha);

      console.log("✅ Dados enviados para a API:");
      formData.forEach((value, key) => console.log(key, value));

      const res = await fetch(`${API_BASE_URL}alterarCadastro`, {
        method: "POST",
        headers: {
          hash,
          idUsuarioLogado: idUsuario.toString(),
        },
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      let data: any;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = { ok: res.ok, raw: await res.text() };
      }

      console.log("📤 Resposta da API:");
      console.log(data);

      if (data.ok) {
        Alert.alert("Sucesso", "Dados atualizados com sucesso!");
        setUsuario({
          ...usuario,
          endereco: {
            ...usuario?.endereco,
            cep,
            uf: estado,
            cidade,       // ✅ use cidade, não municipio
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
      console.log("Erro ao enviar para API:", err);
      Alert.alert("Erro", err.message || "Erro inesperado.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#e6e6e6" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={{ paddingTop: 50, paddingBottom: 10 }}>
        <AppText style={styles.title}>Editar Dados</AppText>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <AppText style={styles.label}>Nome</AppText>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <AppText style={styles.label}>Data de Nascimento</AppText>
          <TextInput
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDateInput(text))}
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
          />

          <AppText style={styles.label}>Celular</AppText>
          <TextInput style={styles.input} value={celular} onChangeText={setCelular} placeholder="(86) 99999-9999" />

          <AppText style={styles.label}>E-mail</AppText>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <AppText style={styles.label}>CEP</AppText>
          <TextInput style={styles.input} value={cep} onChangeText={setCep} />

          <AppText style={styles.label}>Estado</AppText>
          <TextInput style={styles.input} value={estado} onChangeText={setEstado} placeholder="Digite o estado" />
          {estadoFiltrado.length > 0 && (
            <FlatList
              data={estadoFiltrado}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setEstado(item)}>
                  <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <AppText style={styles.label}>Cidade</AppText>
          <TextInput style={styles.input} value={cidade} onChangeText={setCidade} placeholder="Digite a cidade" />
          {cidadeFiltrada.length > 0 && (
            <FlatList
              data={cidadeFiltrada}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setCidade(item)}>
                  <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <AppText style={styles.label}>Bairro</AppText>
          <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

          <AppText style={styles.label}>Logradouro</AppText>
          <TextInput style={styles.input} value={logradouro} onChangeText={setLogradouro} />

          <AppText style={styles.label}>Número</AppText>
          <TextInput style={styles.input} value={numero} onChangeText={setNumero} />

          <AppText style={styles.label}>Complemento</AppText>
          <TextInput style={styles.input} value={complemento} onChangeText={setComplemento} />

          <AppText style={styles.label}>Nova Senha</AppText>
          <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Feather name="save" size={20} color="#fff" />
            <AppText style={styles.buttonText}>Salvar</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { paddingTop: 30, fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 10, color: "#173C6B" },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: { marginTop: 10, fontSize: 14, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 5 },
  button: {
    flexDirection: "row",
    backgroundColor: "#0066cc",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", marginLeft: 10, fontWeight: "bold" },
  suggestion: { padding: 8, backgroundColor: "#eee", borderBottomWidth: 1, borderColor: "#ccc" },
});
