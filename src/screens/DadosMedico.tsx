// DadosMedico.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainStackParamList } from "../types/types";

type RouteParams = RouteProp<MainStackParamList, "DadosMedico">;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function DadosMedico() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NavigationProp>();
  const { service } = route.params;

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nome do médico */}
        <Text style={styles.title}>{service.titulo}</Text>
         <Text style={styles.resumo}>{service.resumo}</Text>

        {/* Dias disponíveis */}
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
            <Text style={styles.infoText}>{service.horarios}</Text>
          </View>
        )}

        {/* Botão de Agendamento */}
        {service.pai !== null && (
          <TouchableOpacity
            style={styles.agendarButton}
            onPress={() => navigation.navigate("agendamento", { service })}
          >
            <Text style={styles.agendarButtonText}>Ir para Agendamento</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: 80 },
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0D3B66", marginBottom: 20 },
  infoBox: { marginBottom: 16 },
  infoTitle: { fontWeight: "600", fontSize: 16, color: "#0D3B66", marginBottom: 4 },
  infoText: { fontSize: 15, color: "#555" },
  agendarButton: {
    backgroundColor: "#0D3B66",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  agendarButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    resumo: { fontSize: 16, color: "#333", marginBottom: 20 },
});
