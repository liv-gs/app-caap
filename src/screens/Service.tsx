import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { ApiService } from "../types/ApiService";
import { normalizeService } from "../context/normalizeService";

type CardNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "Service"
>;

type CardProps = ApiService;

const Card = (service: CardProps) => {
  const navigation = useNavigation<CardNavigationProp>();
  const isSvg = (url: string) => url.toLowerCase().endsWith(".svg");
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("DadosService", { service })}
    >
      <View style={styles.row}>
        {service.imagem_destacada && (
          isSvg(service.imagem_destacada) ? (
            <SvgUri
              uri={service.imagem_destacada}
              style={styles.iconImage}
              width={36}
              height={36}
            />
          ) : (
            <Image
              source={{ uri: service.imagem_destacada }}
              style={styles.iconImage}
              resizeMode="contain"
            />
          )
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{service.title}</Text>
        </View>
      </View>
      <Text style={styles.description}>{service.description}</Text>
    </TouchableOpacity>
  );
};

export default function Service() {
  const { usuario } = useAuth();
  const [services, setServices] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await fetch(
        "https://sites-caapi.mpsip8.easypanel.host/wp-json/caapi/v1/servicos"
      );
      const data = await res.json();

      const mapped: ApiService[] = data.map((item: any) =>
        normalizeService(item, usuario)
      );

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
  <View style={styles.container}>
    {/* Título fixo */}
    <Text style={styles.pageTitle}>Serviços</Text>

    {/* Conteúdo rolável */}
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cardsWrapper}>
        {services.map((service) => (
          <Card key={service.id} {...service} />
        ))}
      </View>
    </ScrollView>
  </View>
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
  
  },
pageTitle: {
  fontSize: 24,
  fontWeight: "600",
  color: "#10567C",
  marginTop: 120, 
  marginBottom: 20,
},

  cardsWrapper: {
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#0D3B66",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    
  },
  textContainer: {
    flex: 1,
  },
  iconImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
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