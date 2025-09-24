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

export default function EditarDados() {
  const { usuario, setUsuario } = useAuth();

  const [nome, setNome] = useState(usuario?.nomeLogado || "");
  const [dataNascimento, setDataNascimento] = useState("");
  const [celular, setCelular] = useState(usuario?.celular || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [cep, setCep] = useState(usuario?.endereco?.cep || "");
  const [estado, setEstado] = useState(usuario?.endereco?.uf || "");
  const [cidade, setCidade] = useState(usuario?.cidade || usuario?.endereco?.municipio || "");

  const [bairro, setBairro] = useState(usuario?.endereco?.bairro || "");
  const [logradouro, setLogradouro] = useState(usuario?.endereco?.logradouro || "");
  const [numero, setNumero] = useState(usuario?.endereco?.numero || "");
  const [complemento, setComplemento] = useState(usuario?.endereco?.complemento || "");
  const [senha, setSenha] = useState(""); // senha obrigatória para confirmar

  const [hash, setHash] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const [ufs, setUfs] = useState<any[]>([]);
  const [ufsFiltradas, setUfsFiltradas] = useState<string[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [cidadeFiltrada, setCidadeFiltrada] = useState<string[]>([]);
  const [cidadeId, setCidadeId] = useState<string>("");

  // Máscara de data de nascimento
  const formatDateInput = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    cleaned = cleaned.substring(0, 8);
    if (cleaned.length >= 5)
      return `${cleaned.substring(0, 2)}/${cleaned.substring(
        2,
        4
      )}/${cleaned.substring(4)}`;
    if (cleaned.length >= 3)
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    return cleaned;
  };

  const formatDateForApi = (text: string) => formatDateInput(text);

  // quando abrir a tela, já formata a data do usuário em dd/mm/aaaa
  useEffect(() => {
    if (usuario?.dataNascimento) {
      setDataNascimento(formatDateInput(usuario.dataNascimento));
    }
  }, [usuario]);

  useEffect(() => {
    const carregarSessao = async () => {
      const savedHash = await getHash();
      const savedUser = await getUsuarioLogado();
      setHash(savedHash);
      if (savedUser) setIdUsuario(savedUser.idUsuarioLogado);
    };

    const carregarUfs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}listarUfs`, { method: "POST" });
        const data = await res.json();
        if (data.ufs) setUfs(data.ufs);
      } catch (err) {
        console.log("Erro ao carregar UFs:", err);
      }
    };

    carregarSessao();
    carregarUfs();
  }, []);

  useEffect(() => {
    const carregarCidades = async () => {
      if (usuario?.endereco?.idMunicipio) {
    setCidadeId(String(usuario.endereco.idMunicipio));
  }
      if (!estado) return;
      try {
        const res = await fetch(`${API_BASE_URL}listarCidades`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ uf: estado }),
        });
        const data = await res.json();
        if (data.cidades) setCidades(data.cidades);
      } catch (err) {
        console.log("Erro ao carregar cidades:", err);
      }
    };
    carregarCidades();
  }, [estado]);

  // Filtrar cidades
  useEffect(() => {
    if (!cidade) setCidadeFiltrada([]);
    else {
      const filtro = cidades.filter((c) =>
        c.nome.toLowerCase().includes(cidade.toLowerCase())
      );
      setCidadeFiltrada(filtro.map((c) => c.nome));
    }
  }, [cidade, cidades]);

  // Filtrar estados
  useEffect(() => {
    if (!estado) setUfsFiltradas([]);
    else {
      const filtro = ufs.filter(
        (u) =>
          u.sigla.toLowerCase().includes(estado.toLowerCase()) ||
          u.nome.toLowerCase().includes(estado.toLowerCase())
      );
      setUfsFiltradas(filtro.map((u) => u.sigla));
    }
  }, [estado, ufs]);

  async function handleSalvar() {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e e-mail são obrigatórios.");
      return;
    }
    if (!hash || !idUsuario) {
      Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
      return;
    }
    if (!senha) {
      Alert.alert("Erro", "Confirme sua senha atual para salvar as alterações.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("dataNascimento", formatDateForApi(dataNascimento));
      formData.append("celular", celular);
      formData.append("email", email);
      formData.append("cep", cep);
      formData.append("bairro", bairro);
      formData.append("logradouro", logradouro);
      formData.append("numero", numero);
      formData.append("complemento", complemento);

      formData.append("cidade", cidadeId || cidade);

      // senha obrigatória para confirmar
      formData.append("senha", senha);

      console.log("Dados a enviar:", {
        nome,
        dataNascimento,
        celular,
        email,
        cep,
        bairro,
        logradouro,
        numero,
        complemento,
        senha,
        cidade: cidadeId || cidade,
      });

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

      if (contentType && contentType.includes("application/json"))
        data = await res.json();
      else data = { ok: res.ok, raw: await res.text() };

      if (data.ok) {
        Alert.alert("Sucesso", "Dados atualizados com sucesso!");

        // atualiza o contexto do usuário com os dados retornados
        const usuarioAtualizado = {
          ...usuario,
          nomeLogado: nome,
          dataNascimento: formatDateForApi(dataNascimento),
          celular,
          email,
          endereco: {
            ...usuario?.endereco,
            id: usuario?.endereco?.id,
            cep,
            logradouro,
            complemento,
            numero,
            bairro,
          },
        };
        setUsuario(usuarioAtualizado);

        console.log("Resposta API alterarCadastro:", data);
      } else {
        Alert.alert("Erro", data.erro || "Não foi possível atualizar os dados.");
      }
    } catch (err: any) {
      console.log("Erro:", err);
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

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <AppText style={styles.label}>Nome</AppText>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <AppText style={styles.label}>Data de Nascimento</AppText>
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDateInput(text))}
            placeholder="dd/mm/aaaa"
            keyboardType="number-pad"
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

          <AppText style={styles.label}>Estado (UF)</AppText>
          <TextInput
            style={styles.input}
            value={estado}
            onChangeText={setEstado}
            placeholder="Digite a UF"
          />
          {ufsFiltradas.length > 0 && (
            <FlatList
              data={ufsFiltradas}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setEstado(item)}>
                  <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <AppText style={styles.label}>Cidade</AppText>
          <TextInput
            style={styles.input}
            value={cidade}
            onChangeText={setCidade}
            placeholder="Digite a cidade"
          />
          {cidadeFiltrada.length > 0 && (
            <FlatList
              data={cidadeFiltrada}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCidade(item);
                    const cidadeSelecionada = cidades.find(
                      (c) => c.nome === item
                    );
                    if (cidadeSelecionada) setCidadeId(cidadeSelecionada.id);
                  }}
                >
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

          <AppText style={styles.label}>Confirme sua Senha</AppText>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Digite sua senha atual"
          />

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
  title: {
    paddingTop: 30,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#173C6B",
  },
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
    marginBottom: 20,
  },
  buttonText: { color: "#fff", marginLeft: 10, fontWeight: "bold" },
  suggestion: {
    padding: 8,
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
