import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// 🔵 IMPORTA A SESSÃO
import { getHash, getUsuarioLogado } from "../api/api";

type Dependente = {
  id: number;
  nome: string;
  cpf: string;
  validadeCarteira: string;
};

export default function ListarDepedente() {
  const navigation = useNavigation<any>();

  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔵 ESTADOS DA SESSÃO
  const [hash, setHash] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  // 🔵 CARREGA SESSÃO AO ABRIR TELA
  useEffect(() => {
    const loadSession = async () => {
      const savedHash = await getHash();
      const savedUser = await getUsuarioLogado();

      if (savedHash) setHash(savedHash);
      if (savedUser) setIdUsuario(savedUser.idUsuarioLogado);

      setLoading(false);
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!hash || !idUsuario) return;

    async function carregarDependentes() {
      try {
        const response = await axios.get(
          "https://caapi.org.br/appcaapi/api/listarDependentes",
          {
            headers: {
              "Content-Type": "application/json",
              hash: hash,               
              idUsuarioLogado: idUsuario.toString(), 
            },
          }
        );

        console.log("📥 Resposta listarDependente:", response.data);

        setDependentes(response.data.dependentes || []);

      } catch (error: any) {
        console.log("❌ Erro:", error?.response?.data || error);
        Alert.alert("Erro", "Não foi possível carregar os dependentes.");
      }finally{
        setLoading(false);
      }
    }

    carregarDependentes();
  }, [hash, idUsuario]);

  function irParaHome() {
    navigation.navigate("MainStack", {
      screen: "Tabs",
      params: { screen: "Home" },
    });
  }

  function irParaCadastro() {
    navigation.navigate("MainStack", { screen: "CadastroDependente" });
  }

  function formatarData(data: string) {
  if (!data) return "—";

  const partes = data.split("-"); // yyyy-mm-dd
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


  return (
    <View style={styles.container}>
      {/* BOTÃO VOLTAR */}
      <TouchableOpacity style={styles.backButton} onPress={irParaHome}>
        <Ionicons name="arrow-back" size={26} color="#0D3B66" />
      </TouchableOpacity>

      <Text style={styles.title}>Dependentes</Text>

      {/* LOADING ENQUANTO CARREGA SESSÃO OU API */}
      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#0D6EFD" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {dependentes.length > 0 ? (
            dependentes.map((dep) => (
              <View key={dep.id} style={styles.card}>
                <Text style={styles.cardTitle}>{dep.nome}</Text>
                <Text style={styles.cardText}>CPF: {dep.cpf}</Text>
               <Text style={styles.cardText}>
                Validade: {formatarData(dep.validadeCarteira)}
              </Text>

              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
              Nenhum dependente encontrado.
            </Text>
          )}

          <TouchableOpacity style={styles.addButton} onPress={irParaCadastro}>
            <Text style={styles.addButtonText}>Adicionar Dependente</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50, backgroundColor: "#fff" },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
    padding: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  cardText: { fontSize: 15, color: "#555" },
  addButton: {
    backgroundColor: "#0D6EFD",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 50,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
