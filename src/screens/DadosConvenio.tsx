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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AppText from "../components/AppText";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type DadosConvenioRouteProp = RouteProp<RootStackParamList, "DadosConvenio">;

type Convenio = {
  id: number;
  title: string;
  content: string;
  image: string | false;
  cidade: string[];
  categoria: string[];
};

export default function DadosConvenio() {
  const navigation = useNavigation();
  const route = useRoute<DadosConvenioRouteProp>();
  const { categoria } = route.params;

  const [data, setData] = useState<Convenio[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchConvenios = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const url = `https://sites-caapi.mpsip8.easypanel.host/wp-json/clube/v1/filtro?cidade=&categoria=${categoria ?? ""}&page=${page}&per_page=10`;

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
  }, [page, loading, hasMore, categoria]);

  useEffect(() => {
    const load = async () => {
      setData([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      try {
        const url = `https://sites-caapi.mpsip8.easypanel.host/wp-json/clube/v1/filtro?cidade=&categoria=${categoria ?? ""}&page=1&per_page=10`;
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
  }, [categoria]);

  const abrirLink = (url: string) => {
    if (url) Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: Convenio }) => (
    <View style={styles.card}>
      {item.image ? (
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.imagem}
          imageStyle={{ borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}
        >
          <View style={styles.overlay}>
            <AppText style={styles.tituloOverlay}>{item.title}</AppText>
          </View>
        </ImageBackground>
      ) : (
        <View
          style={[
            styles.imagem,
            { justifyContent: "center", alignItems: "center", backgroundColor: "#ccc" },
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

        {item.cidade?.length > 0 && (
          <View style={styles.badgeContainer}>
            {item.cidade.map((cidade) => (
              <AppText key={cidade} style={styles.badge}>📍 {cidade}</AppText>
            ))}
          </View>
        )}

        {item.categoria?.length > 0 && (
          <View style={styles.badgeContainer}>
            {item.categoria.map((cat) => (
              <AppText key={cat} style={styles.badge}>🏷️ {cat}</AppText>
            ))}
          </View>
        )}

        {item.content.includes("http") && (
          <TouchableOpacity
            onPress={() => {
              const regex = /(https?:\/\/[^\s"]+)/g;
              const link = item.content.match(regex)?.[0];
              if (link) abrirLink(link);
            }}
          >
            <AppText style={styles.link}>Visite nosso site</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#0D3B66" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Convênios</Text>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 80, flex: 1, paddingHorizontal: 20, backgroundColor: "#e1e1e167" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 16 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#0D3B66" },
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
  imagem: {
    flex: 1.2,
    height: 180,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
  },
  tituloOverlay: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  info: { flex: 2, padding: 12 },
  titulo: { fontSize: 16, fontWeight: "600", color: "#0D3B66", marginBottom: 4 },
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
});
