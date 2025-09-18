import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import type { MainStackParamList } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { ApiService } from "../types/ApiService";
import { normalizeService } from "../context/normalizeService";

type CardNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "Service"
>;

// 🔹 Mapeamento de ícones por título
const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
  Auxílio: "heart",
  Convênios: "briefcase",
  Fisioterapia: "activity",
  Odonto: "smile",
  "Clube da Advocacia": "users",
  "Hotel de Trânsito": "home",
  "OAB Prev": "shield",
  "Plano de Saúde": "heart",
  "Pousada Praia dos Advogados": "umbrella",
  "Salão de Beleza": "scissors",
};

type CardProps = ApiService;

const Card = (service: CardProps) => {
  const navigation = useNavigation<CardNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("DadosService", {
          service, // já passa o objeto normalizado inteiro
        })
      }
    >
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Feather
            name={service.icon}
            size={22}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.title}>{service.title}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#fff" />
      </View>
      <Text style={styles.description}>{service.description}</Text>
    </TouchableOpacity>
  );
};

export default function Service() {
  const { usuario } = useAuth();
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://sites-caapi.mpsip8.easypanel.host/wp-json/caapi/v1/servicos"
        );
        const data = await res.json();

        const mapped: ApiService[] = data.map((item: any) => {
          const normalized = normalizeService(item);
          return {
            ...normalized,
            icon: iconMap[item.titulo] || "briefcase", // ícone tratado aqui
          };
        });

        setServices(mapped);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#10567C" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Serviços</Text>
      <View style={styles.cardsWrapper}>
        {services.map((service) => (
          <Card key={service.id} {...service} />
        ))}
      </View>
    </ScrollView>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 100,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    color: "#10567C",
  },
  cardsWrapper: {
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#0D3B66",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 20,
    marginTop: 4,
  },
});
