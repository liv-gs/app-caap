import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SvgUri } from "react-native-svg";
import type { MainStackParamList } from "../types/types";

type RouteParams = RouteProp<MainStackParamList, "DadosService">;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function DadosService() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const { service } = route.params;

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Extrai TODAS as imagens do campo content
  const regex = /<img.*?src="(.*?)"/g;
  const matches = [...(service.content?.matchAll(regex) || [])];
  const contentImages = matches.map((m) => m[1]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{service.title}</Text>

  
        {/* Todas as imagens encontradas no content */}
        {contentImages.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}

        <Text style={styles.description}>{service.description}</Text>

        {/* Dias da semana */}
        {service.dias?.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Dias disponíveis:</Text>
            <Text style={styles.infoText}>
              {service.dias.map((d: number) => diasSemana[d]).join(", ")}
            </Text>
          </View>
        )}

        {/* Horários */}
        {service.horarios?.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Horários:</Text>
            <Text style={styles.infoText}>{service.horarios.join(", ")}</Text>
          </View>
        )}

        {/* Link */}
        {service.link && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(service.link)}
          >
            <Text style={styles.linkText}>Abrir site</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("agendamento", { service })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Ir para Agendamento</Text>
            <AntDesign
              name="arrow-right"
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop:100,},
  scrollContent: { flexGrow: 1, padding: 20 },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D3B66",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  infoBox: { marginBottom: 16 },
  infoTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#0D3B66",
    marginBottom: 4,
  },
  infoText: { fontSize: 15, color: "#555" },
  linkButton: {
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: "#1D75CD",
    borderRadius: 10,
    alignItems: "center",
  },
  linkText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  button: {
    backgroundColor: "#0D3B66",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
