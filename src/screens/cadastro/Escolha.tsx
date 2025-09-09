// screens/cadastro/EscolhaTipoScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation";

type NavProp = NativeStackNavigationProp<AuthStackParamList, "EscolhaTipo">;

export default function EscolhaTipoScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você é:</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CadastroDados", { tipo: "advogado" })}
      >
        <Text style={styles.buttonText}>Advogado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CadastroDados", { tipo: "colaborador" })}
      >
        <Text style={styles.buttonText}>Colaborador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  button: {
    width: "80%",
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#CF1920",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18, textAlign: "center" },
});
