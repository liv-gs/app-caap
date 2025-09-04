import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/DrawerNavigation";
import { Feather } from "@expo/vector-icons"; // Ícones

// Tipagem para navigation do Card
type CardNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  "Service"
>;

// Props do Card
type CardProps = {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap; // nome do ícone Feather
};

// Dados dos serviços
const services = [
  {
    title: "Auxílio",
    description:
      "Benefícios em sua rede de proteção social, que auxiliam os advogados e suas famílias nos momentos em que mais precisam.",
    icon: "heart",
  },
  {
    title: "Convênios",
    description:
      "Ampla relação de convênios em diversos serviços e estabelecimentos, garantindo descontos exclusivos para profissionais devidamente inscritos na OAB/PI.",
    icon: "briefcase",
  },
  {
    title: "Fisioterapia",
    description:
      "Consultório para Fisioterapia, totalmente equipado com profissionais qualificados para atender em diversas especialidades.",
    icon: "activity",
  },
  {
    title: "Odonto",
    description:
      "Consultórios e profissionais especializados que cuidam do seu sorriso e também do sorriso da sua família.",
    icon: "smile",
  },
  {
    title: "Clube da Advocacia",
    description:
      "Espaço de lazer para receber os advogados, familiares e convidados durante os finais de semana e feriados.",
    icon: "users",
  },
  {
    title: "Hotel de Trânsito",
    description:
      "Com a finalidade de hospedar advogados em trânsito na cidade de Teresina para o exercício de suas atividades profissionais.",
    icon: "home",
  },
  {
    title: "OAB Prev",
    description:
      "Fundo de previdência complementar com benefícios exclusivos para advogados e familiares dependentes inscritos na Caixa de Assistência dos Advogados.",
    icon: "shield",
  },
  {
    title: "Plano de Saúde",
    description:
      "Num só plano preventivo e com foco na qualidade de vida do usuário, o advogado tem o direito de ter acesso à assistência à saúde sempre que precisar.",
    icon: "heart",
  },
  {
    title: "Pousada Praia dos Advogados",
    description:
      "Em Luís Correia, a Caixa disponibiliza aos advogados uma pousada aconchegante e confortável próxima da praia de Atalaia.",
    icon: "umbrella",
  },
  {
    title: "Salão de Beleza",
    description:
      "O Salão de Beleza oferece atendimento exclusivo para advogados com preços diferenciados.",
    icon: "scissors",
  },
];

// Card Component
const Card = ({ title, description, icon }: CardProps) => {
  const navigation = useNavigation<CardNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DadosService")}
    >
      <View style={styles.row}>
        {/* Ícone + Título */}
        <View style={styles.leftSection}>
          <Feather name={icon} size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Seta para a direita */}
        <Feather name="chevron-right" size={20} color="#fff" />
      </View>

      {/* Descrição */}
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

// Tela principal Service
export default function Service() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Serviços</Text>
      <View style={styles.cardsWrapper}>
        {services.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Estilos
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
