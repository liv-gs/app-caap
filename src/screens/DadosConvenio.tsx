import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Linking,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import AppText from "../components/AppText";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { MainStackParamList } from "../types/types";
type DadosConvenioRouteProp = RouteProp<MainStackParamList, "DadosConvenio">;
import { ScrollView, Image } from "react-native";


type Convenio = {
  id: number;
  title: string;
  content: string;
  image: string | false;
  cidade: string[];
  categoria: string[];
};

type Cidade = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export default function DadosConvenio() {
  const navigation = useNavigation();
  const route = useRoute<DadosConvenioRouteProp>();
  const { categoria } = route.params;

  const [data, setData] = useState<Convenio[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");

  // Estado para modal
  const [selectedConvenio, setSelectedConvenio] = useState<Convenio | null>(
    null
  );

  // 🔹 Buscar cidades
  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const res = await fetch(
          "https://caapi.org.br/wp-json/clube/v1/cidades"
        );
        const json = await res.json();
        setCidades(json);
      } catch (err) {
        console.error("Erro ao buscar cidades:", err);
      }
    };

    fetchCidades();
  }, []);

  // 🔹 Buscar convênios
  const fetchConvenios = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const url = `https://caapi.org.br/wp-json/clube/v1/filtro?cidade=${cidadeSelecionada}&categoria=${
        categoria ?? ""
      }&page=${page}&per_page=10`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.length === 0) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...json]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erro ao buscar convênios:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, categoria, cidadeSelecionada]);

  // 🔹 Quando trocar categoria OU cidade, resetar busca
  useEffect(() => {
    const load = async () => {
      setData([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      try {
        const url = `https://caapi.org.br/wp-json/clube/v1/filtro?cidade=${cidadeSelecionada}&categoria=${
          categoria ?? ""
        }&page=1&per_page=10`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
        if (json.length === 0) setHasMore(false);
        else setPage(2);
      } catch (err) {
        console.error("Erro ao buscar convênios:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoria, cidadeSelecionada]);

  const abrirLink = (url: string) => {
      if (url) Linking.openURL(url);
    };

    const cidadesUnicas = Array.from(
    new Set(selectedConvenio?.cidade ?? [])
  );

  const categoriasUnicas = Array.from(
    new Set(selectedConvenio?.categoria ?? [])
  );


  const renderItem = ({ item }: { item: Convenio }) => (
    <View style={styles.card}>
      {item.image ? (
       <ImageBackground
        source={{ uri: item.image }}
        style={styles.imagem}
        imageStyle={{ borderTopLeftRadius: 16, borderBottomLeftRadius: 16, resizeMode: "contain" }}
      >
        </ImageBackground>
      ) : (
        <View
          style={[
            styles.imagem,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#ccc",
            },
          ]}
        >
          <Text>Sem imagem</Text>
        </View>
      )}

      <View style={styles.info}>
        {!item.image && <AppText style={styles.titulo}>{item.title}</AppText>}

        <AppText style={styles.descricao} numberOfLines={3}>
          {item.content.replace(/<[^>]*>/g, "")}
        </AppText>

        <TouchableOpacity onPress={() => setSelectedConvenio(item)}>
          <AppText style={styles.link}>Ver mais</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
return (
  <View style={styles.container}>
    {/* 🔹 Header + Filtro juntos */}
    <View style={styles.topContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#0D3B66" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Convênios</Text>
      </View>

      {/* 🔹 Filtro de cidades */}
      <View style={styles.filtro}>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={cidades.map((c) => ({ label: c.name, value: c.slug }))}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Selecione a cidade"
          value={cidadeSelecionada}
          onChange={(item) => {
            setCidadeSelecionada(item.value);
          }}
        />
      </View>
    </View>

    {/* 🔹 Lista */}
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
      onEndReached={fetchConvenios}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator size="small" color="#0D3B66" /> : null
      }
    />

    {/* 🔹 Modal com detalhes */}
     <Modal
    visible={!!selectedConvenio}
    transparent
    animationType="slide"
    onRequestClose={() => setSelectedConvenio(null)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* Imagem */}
        {selectedConvenio?.image && (
          <Image
            source={{ uri: selectedConvenio.image }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Título */}
          <AppText style={styles.modalTitle}>
            {selectedConvenio?.title}
          </AppText>

          {/* Descrição */}
          <AppText style={styles.modalDescricao}>
            {selectedConvenio?.content.replace(/<[^>]*>/g, "")}
          </AppText>

          {/* Cidades */}
          {cidadesUnicas.length > 0 && (
            <View style={styles.badgeContainer}>
              {cidadesUnicas.map((cidade) => (
                <AppText key={`cidade-${cidade}`} style={styles.badge}>
                  📍 {cidade}
                </AppText>
              ))}
            </View>
          )}
          {/* Categorias */}
          {categoriasUnicas.length > 0 && (
            <View style={styles.badgeContainer}>
              {categoriasUnicas.map((cat) => (
                <AppText key={`categoria-${cat}`} style={styles.badge}>
                  🏷️ {cat}
                </AppText>
              ))}
            </View>
          )}

        </ScrollView>

        {/* Botão */}
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setSelectedConvenio(null)}
        >
          <AppText style={styles.modalButtonText}>Fechar</AppText>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1e1e167",
    paddingHorizontal: 20,
  },
  modalImage: {
  width: "100%",
  height: 180,
  borderRadius: 10,
  marginBottom: 12,
  backgroundColor: "#f2f2f2",
},

badgeSection: {
  marginBottom: 12,
},

sectionTitle: {
  fontSize: 14,
  fontWeight: "700",
  color: "#0D3B66",
  marginBottom: 6,
},

modalButtonText: {
  color: "#fff",
  fontWeight: "bold",
},

  topContainer: {
    paddingTop: 130, 
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0D3B66",
  },
  filtro: {
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  imagem: { flex: 1.2, height: 180 },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  tituloOverlay: { color: "#fff", fontWeight: "700", fontSize: 16 },
  info: { flex: 2, padding: 12 },
  titulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D3B66",
    marginBottom: 4,
  },
  descricao: { fontSize: 14, color: "#333", marginBottom: 6 },
  badgeContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  badge: {
    backgroundColor: "#12adaf20",
    color: "#12adaf",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 4,
    overflow: "hidden",
  },
  link: { fontSize: 14, color: "#12adaf", fontWeight: "bold" },

  dropdownContainer: {
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#0D3B66",
    fontWeight: "600",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: "#0D3B66",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
     height: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0D3B66",
  },
  modalDescricao: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#0D3B66",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
