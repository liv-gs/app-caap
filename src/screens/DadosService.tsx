import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";
import type { MainStackParamList } from "../types/types";
import { Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons";



type RouteParams = RouteProp<MainStackParamList, "DadosService">;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

function parseHtmlContent(html: string) {
  const regex = /<img.*?src="(.*?)".*?>/g;
  const result: Array<{ type: "text" | "image"; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: "text", content: html.substring(lastIndex, match.index) });
    }
    result.push({ type: "image", content: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < html.length) {
    result.push({ type: "text", content: html.substring(lastIndex) });
  }

  return result;
}

export default function DadosService() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const { service } = route.params;
  const { width } = useWindowDimensions();

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const contentBlocks = parseHtmlContent(service.content || "");

  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        setLoadingProfissionais(true);
        const res = await fetch(
          `https://sites-caapi.mpsip8.easypanel.host/wp-json/caapi/v1/servicos?idpai=${service.id}`
        );
        const data = await res.json();
        setProfissionais(data);
      } catch (err) {
        console.log("Erro ao buscar profissionais:", err);
      } finally {
        setLoadingProfissionais(false);
      }
    };

    fetchProfissionais();
  }, [service.id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.title}>{service.title}</Text>

        {/* Conteúdo HTML */}
        {contentBlocks.map((block, idx) =>
          block.type === "text" ? (
            <RenderHTML
              key={idx}
              contentWidth={width - 40}
              source={{ html: block.content }}
              tagsStyles={{
                p: { fontSize: 16, lineHeight: 24, marginBottom: 12, color: "#333" },
                h1: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
                h2: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
                h3: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
                li: { fontSize: 16, lineHeight: 24, color: "#444", marginBottom: 6 },
                strong: { fontWeight: "700" },
                em: { fontStyle: "italic" },
                a: { color: "#1D75CD", textDecorationLine: "underline" },
              }}
            />
          ) : (
            <Image
              key={idx}
              source={{ uri: block.content }}
              style={styles.image}
              resizeMode="cover"
            />
          )
        )}

        {/* Dias */}
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
        {/* Link do serviço */}
          {service.link && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(service.link)}
            >
              <Text style={styles.linkText}>Abrir site</Text>
            </TouchableOpacity>
          )}


        {/* Profissionais */}
        {loadingProfissionais ? (
          <ActivityIndicator size="large" color="#10567C" />
        ) : profissionais.length > 0 ? (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.subTitle}>Profissionais disponíveis:</Text>

          {profissionais.map((prof) => (
            <TouchableOpacity
              key={prof.id}
              style={styles.medicoButton}
              onPress={() => navigation.navigate("agendamento", { service: prof })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.medicoNome}>{prof.titulo}</Text>
                <Text style={styles.medicoResumo}>{prof.resumo}</Text>
              </View>

              <View style={styles.agendarContainer}>
                <Text style={styles.agendarTexto}>Agendar</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}

          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: 100 },
  scrollContent: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0D3B66", marginBottom: 12 },
  subTitle: { fontSize: 18, fontWeight: "bold", color: "#0D3B66", marginBottom: 12 },
  image: { width: "100%", height: 200, borderRadius: 16, marginVertical: 10 },
  infoBox: { marginBottom: 16 },
  infoTitle: { fontWeight: "600", fontSize: 16, color: "#0D3B66", marginBottom: 4 },
  infoText: { fontSize: 15, color: "#555" },
  medicoButton: {
  backgroundColor: "#0D3B66",
  padding: 16,
  borderRadius: 12,
  marginBottom: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

medicoNome: {
  fontSize: 16,
  fontWeight: "700",
  color: "#fff",
  marginBottom: 4,
},

medicoResumo: {
  fontSize: 14,
  color: "#E0E0E0",
},

agendarContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4, // afasta um pouquinho o texto da seta
},

agendarTexto: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "500",
},

  linkButton: {
  marginBottom: 20,
  paddingVertical: 12,
  backgroundColor: "#1D75CD",
  borderRadius: 10,
  alignItems: "center",
},
linkText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
},
medicoCard: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  padding: 12,
  marginVertical: 6,
  borderRadius: 10,
  elevation: 2,
},
agendarButton: {
  backgroundColor: "#184E77",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
},

});