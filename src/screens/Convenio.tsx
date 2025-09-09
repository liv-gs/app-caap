import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Feather,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";


type IconConfig = {
  lib: "Feather" | "FontAwesome" | "MaterialIcons" | "Ionicons" | "AntDesign"|"FontAwesome5"|"MaterialCommunityIcons";
  name: string;
};

// --- MAPA DE ÍCONES POR CATEGORIA ---
const iconMap: Record<string, IconConfig> = {
  alimentacao: { lib: "FontAwesome", name: "cutlery" },
  "construcao-e-decoracao": { lib: "FontAwesome5", name: "warehouse" },
  educacao: { lib: "FontAwesome", name: "book" },
  "energia-solar": { lib: "Feather", name: "sun" },
  entretenimento: { lib: "FontAwesome5", name: "film" },
  escritorios: { lib: "FontAwesome5", name: "building" },
  esporte: { lib: "MaterialCommunityIcons", name: "bike" },
  estetica: { lib: "Feather", name: "scissors" },
  eventos: { lib: "AntDesign", name: "calendar" },
  floriculturas: { lib: "MaterialCommunityIcons", name: "flower" },
  hotel: { lib: "FontAwesome", name: "hotel" },
  odontologico: { lib: "MaterialCommunityIcons", name: "tooth" },
  opticas: { lib: "Ionicons", name: "glasses-outline" },
  saude: { lib: "FontAwesome", name: "heartbeat" },
  "seguro-e-previdencia": { lib: "Feather", name: "shield" },
  "servicos-automotivos": { lib: "Feather", name: "truck" },
  "servicos-de-seguranca": { lib: "Feather", name: "lock" },
  "servicos-financeiros": { lib: "Feather", name: "dollar-sign" },
  "servicos-gerais": { lib: "Feather", name: "settings" },
  tecnologia: { lib: "Feather", name: "cpu" },
  turismo: { lib: "Feather", name: "navigation" },
  "vestuario-e-acessorios": { lib: "Feather", name: "shopping-bag" },
  veterinaria: { lib: "MaterialIcons", name: "pets" },
  default: { lib: "Feather", name: "tag" },
};

type Categoria = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type CategoriasScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Categorias"
>;

export default function CategoriasScreen() {
  const navigation = useNavigation<CategoriasScreenNavigationProp>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch(
          "https://sites-caapi.mpsip8.easypanel.host/wp-json/clube/v1/categorias"
        );
        const json = await res.json();
        setCategorias(json);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  const renderIcon = (slug: string) => {
    const icon = iconMap[slug] || iconMap.default;

    switch (icon.lib) {
      case "Feather":
        return <Feather name={icon.name as any} size={20} color="#1D81B8" />;
      case "FontAwesome":
        return <FontAwesome name={icon.name as any} size={20} color="#1D81B8" />;
      case "MaterialIcons":
        return <MaterialIcons name={icon.name as any} size={20} color="#1D81B8" />;
      case "Ionicons":
        return <Ionicons name={icon.name as any} size={20} color="#1D81B8" />;
      case "AntDesign":
        return <AntDesign name={icon.name as any} size={20} color="#1D81B8" />;
      case "FontAwesome5":
        return <FontAwesome5 name={icon.name as any} size={20} color="#1D81B8" />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons  name={icon.name as any} size={20} color="#1D81B8" />;
      default:
        return <Feather name="tag" size={20} color="#1D81B8" />;
    }
  };

  const renderItem = ({ item }: { item: Categoria }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DadosConvenio", { categoria: item.slug })
      }
    >
      {/* Ícone + Nome */}
      <View style={styles.leftContent}>
        {renderIcon(item.slug)}
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>

      {/* Seta */}
      <Feather name="chevron-right" size={20} color="#EEF4FB" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Convênios</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#173C6B" />
      ) : (
        <FlatList  
          data={categorias}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120 ,
    paddingHorizontal: 20,
    backgroundColor: "#e1e1e167",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#10567C",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#173C6B",
    padding: 25,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 1,  //sombra
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#EEF4FB",
    marginLeft: 10,
  },
});
