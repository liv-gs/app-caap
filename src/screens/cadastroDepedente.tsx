import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getHash, getUsuarioLogado } from "../api/api";
import AppText from "../components/AppText";


export default function CadastroDependente() {
  const navigation = useNavigation<any>();


const onlyDigits = (v: string) => v.replace(/\D/g, "");

const maskDate = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  return d
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
};

const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};


  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [celular, setCelular] = useState("");

  // 🔵 Sessão
  const [hash, setHash] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);


  useEffect(() => {
    const carregarSessao = async () => {
      const savedHash = await getHash();
      const savedUser = await getUsuarioLogado();

      if (savedHash) setHash(savedHash);
      if (savedUser) setIdUsuario(savedUser.idUsuarioLogado);
    };
    carregarSessao();
  }, []);

  
  function validar() {
    if (!nome) return "Informe o nome!";
    if (!cpf) return "Informe o CPF!";
    if (onlyDigits(cpf).length !== 11) return "CPF inválido!";
    if (!rg) return "Informe o RG!";
    if (!dataNascimento) return "Informe a data de nascimento!";
    if (!celular) return "Informe o celular!";
    return null;
  }

  async function salvar() {
    const erro = validar();
    if (erro) {
      Alert.alert("Atenção", erro);
      return;
    }

    if (!hash || !idUsuario) {
      Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
      return;
    }

    try {
      // 🔵 FormData igual a tela modelo
      const dadosTemp = new FormData();
      dadosTemp.append("nome", nome);
      dadosTemp.append("cpf", onlyDigits(cpf));
      dadosTemp.append("rg", rg);
      dadosTemp.append("dataNascimento", dataNascimento);
      dadosTemp.append("celular", onlyDigits(celular));

      console.log("📤 ENVIANDO PARA A API:");
     

      const response = await axios.post(
        "https://caapi.org.br/appcaapi/api/salvarDependente",
        dadosTemp,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            hash: hash,
            idUsuarioLogado: idUsuario.toString(),
          },
        }
      );

      console.log("📥 RESPOSTA API cadastrar dependente:", response.data);

      if (response.data.ok) {
        Alert.alert("Sucesso!", "Dependente cadastrado com sucesso!");
        navigation.navigate("ListarDependente");
      } else {
        Alert.alert("Erro", response.data.erro || "Falha ao salvar.");
      }
    } catch (error: any) {
      console.log("❌ Erro ao salvar dependente:", error?.response?.data || error);
      Alert.alert("Erro", "Não foi possível salvar o dependente.");
    }
  }

  return (
    <View style={styles.container}>
      <View  style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("ListarDependente")}>
            <Ionicons name="arrow-back" size={26} color="#0D3B66" />
          </TouchableOpacity>
          <AppText style={styles.title}>Dados do Dependente</AppText>
      </View>
    
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="CPF"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />

          <TextInput
            style={styles.input}
            placeholder="RG"
            keyboardType="numeric"
            value={rg}
            onChangeText={setRg}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de nascimento"
            keyboardType="numeric"
            value={dataNascimento}
            onChangeText={(t) => setDataNascimento(maskDate(t))}
          />

          <TextInput
            style={styles.input}
            placeholder="Celular"
            keyboardType="phone-pad"
            value={celular}
            onChangeText={(t) => setCelular(maskPhone(t))}
          />

        </ScrollView>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={salvar}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>
       <View style={styles.avisoCard}>
          <Text style={styles.avisoText}>
            Para o dependente realizar o primeiro acesso ao App, basta utilizar o CPF como login e senha.
          </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 100, backgroundColor: "#E5E7EB" },
  title: { fontSize: 20, fontWeight: "500", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    maxHeight: 330,
    elevation:5
  },
    header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#ddd",
    color:"#2d2d2dff"
  },
  saveButton: {
    backgroundColor: "#0D3B66",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
   avisoCard: {
    backgroundColor: "#FFF3CD",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFEEA8",
  },
  avisoText: { color: "#715C00", fontSize: 14, textAlign: "center" },
});
