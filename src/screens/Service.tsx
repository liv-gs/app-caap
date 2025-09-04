import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DadosService from "../screens/DadosService";
const services = [
  {
    title: "Auxílio",
    description: "Benefícios em sua rede de proteção social, que auxiliam os advogados e suas famílias nos momentos em que mais precisam.",
    icon: "support-agent",
  },
  {
    title: "Convênios",
    description: "Ampla relação de convênios em diversos serviços e estabelecimentos, garantindo descontos exclusivos para profissionais devidamente inscritos na OAB/PI.",
    icon: "handshake",
  },
  {
    title: "Fisioterapia",
    description: "Consultório para Fisioterapia, totalmente equipado com profissionais qualificados para atender em diversas especialidades.",
    icon: "healing",
  },
  {
    title: "Odonto",
    description: "Consultórios e profissionais especializados que cuidam do seu sorriso e também do sorriso da sua família.",
    icon: "medical-services",
  },
  {
    title: "Clube da Advocacia",
    description: "Espaço de lazer para receber os advogados, familiares e convidados durante os finais de semana e feriados.",
    icon: "groups",
  },
  {
    title: "Hotel de Trânsito",
    description: "Com a finalidade de hospedar advogados em trânsito na cidade de Teresina para o exercício de suas atividades profissionais.",
    icon: "hotel",
  },
  {
    title: "OAB Prev",
    description: "Fundo de previdência complementar com benefícios exclusivos para advogados e familiares dependentes inscritos na Caixa de Assistência dos Advogados.",
    icon: "savings",
  },
  {
    title: "Plano de Saúde",
    description: "Num só plano preventivo e com foco na qualidade de vida do usuário, o advogado tem o direito de ter acesso à assistência à saúde sempre que precisar.",
    icon: "favorite",
  },
  {
    title: "Pousada Praia dos Advogados",
    description: "Em Luís Correia, a Caixa disponibiliza aos advogados uma pousada aconchegante e confortável próxima da praia de Atalaia.",
    icon: "beach-access",
  },
  {
    title: "Salão de Beleza",
    description: "O Salão de Beleza oferece atendimento exclusivo para advogados com preços diferenciados.",
    icon: "content-cut",
  },
];

const Card = ({ title, description, icon }) => {
    const navigation = useNavigation();
  return (
   <TouchableOpacity
      style={{ marginBottom: 16, backgroundColor: "#0D3B66", padding: 20, borderRadius: 16 }}
    >
      <View style={styles.cardHeader}>
        <MaterialIcons name={icon} size={24} color="#4FC3F7" />
        <MaterialIcons name="arrow-forward" size={24} color="#fff" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

export default function Service() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent} // 👈 aqui
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Serviços</Text>
      <View style={styles.cardsWrapper}>
        {services.map((item, index) => (
          <Card key={index} title={item.title} description={item.description} icon={item.icon} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 30,
  },
  scrollContent: {
    paddingBottom: 40, // 👈 garante espaço extra no final
    paddingTop:100,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    color: "#0D3B66",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 6,
    lineHeight: 20,
  },
});