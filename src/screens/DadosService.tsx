import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
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
  const { service } = route.params; // ✅ já vem da navegação

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{service.title}</Text>

        {service.imagem_destacada?.endsWith(".svg") ? (
          <SvgUri width="100%" height={200} uri={service.imagem_destacada} />
        ) : service.imagem_destacada ? (
          <Image
            source={{ uri: service.imagem_destacada }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}

        <Text style={styles.description}>{service.description}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("agendamento")}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Ir para Agendamento</Text>
            <AntDesign name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop:200, },
  scrollContent: { flexGrow: 1, padding: 20 },
  image: { width: "100%", height: 200, borderRadius: 16, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0D3B66", marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: "#333", marginBottom: 30 },
  button: { backgroundColor: "#0D3B66", paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  container: { flex: 1, backgroundColor: "#fff" },
});
