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
import type { Usuario } from "../types/Usuario";
import { useAuth } from "../context/AuthContext";
import {ApiService} from "../types/ApiService"




type CardNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "Service"
>;

// 🔹 Mapeamento de ícones por título (você pode expandir conforme sua API)
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

const Card = ({ id, title, description, icon, imagem_destacada, usuario, tipo, horarios, diaria, dias }: CardProps) => {
  const navigation = useNavigation<CardNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("DadosService", {
          service: {
            id,
            title,
            description,
            imagem_destacada,
            icon,
            usuario,
            tipo,
            horarios: horarios || [],
            diaria: diaria || false,
            dias: dias || [1, 2, 3, 4, 5]
            
          },
        })
      }
    >
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Feather
            name={icon}
            size={22}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#fff" />
      </View>
      <Text style={styles.description}>{description}</Text>
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

        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.resumo || item.content,
          imagem_destacada: item.imagem_destacada,
          icon: iconMap[item.title] || "briefcase",
          usuario: item.usuario, // se a API enviar
          tipo: item.diaria ? "hotel" : "horario",
          horarios: item.horarios || [],   // <- garante que vai para o Calendar
          dias: item.dias || [0,1,2,3,4,5,6], // <- dias permitidos
          diaria: item.diaria || false,    // <- se for diária
        }));

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
        {services.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            imagem_destacada={item.imagem_destacada}
            usuario={item.usuario}
            tipo={item.tipo}
            horarios={item.horarios}   // <- obrigatório
            diaria={item.diaria}       // <- obrigatório
            dias={item.dias}           // <- obrigatório
          />
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
