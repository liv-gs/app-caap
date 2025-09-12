import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/index"; // ajuste o caminho

type NavProp = NativeStackNavigationProp<AuthStackParamList, "CadastroValidacao">;

const Validacao: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      {/* Card central */}
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro aguardando validação</Text>
        <Text style={styles.subtitle}>
          Você receberá uma notificação quando liberado.
        </Text>
      </View>

      {/* Voltar */}
      <TouchableOpacity
        style={{ marginTop: 32 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backText}>Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
  },
  backText: {
    fontSize: 16,
    color: "#000",
    textDecorationLine: "underline",
  },
});

export default Validacao;
