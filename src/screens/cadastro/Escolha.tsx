// screens/cadastro/EscolhaTipoScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation";
import LogoSvg from "../../../assets/images/Camada_1.svg";
import FundoSvg from "../../../assets/images/FUNDO.svg";

type NavProp = NativeStackNavigationProp<AuthStackParamList, "EscolhaTipo">;

export default function EscolhaTipoScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      {/* Fundo absoluto — coloquei dentro de um wrapper com pointerEvents="none" */}
      <View style={styles.fundoWrapper} pointerEvents="none">
        <FundoSvg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      {/* Conteúdo principal — zIndex/elevation para ficar acima do fundo */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* Uso width/height numéricos para evitar surpresas */}
          <LogoSvg width={300} height={160} /* fill="black" */ />
        </View>

        {/* Container dos botões */}
        <View style={styles.buttonsContainer}>
          <Text style={styles.title}>Você é:</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CadastroDados", { tipo: "advogado" })}
          >
            <Text style={styles.buttonText}>Sou Advogado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CadastroDados", { tipo: "colaborador" })}
          >
            <Text style={styles.buttonText}>Sou Colaborador</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  fundoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // zIndex irrelevante aqui, o importante é o content ter zIndex/elevation maior
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    // trazer para frente:
    ...(Platform.OS === "android" ? { elevation: 6 } : { zIndex: 1 }),
  },
  logoContainer: {
    // removi flex:1 para a logo não "empurrar" tudo
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    marginVertical: 10,
    backgroundColor: "#ff0000df",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
