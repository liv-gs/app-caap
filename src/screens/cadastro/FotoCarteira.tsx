import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { launchCamera, Asset } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import FundoSvg from "../../../assets/images/FUNDO.svg";
import LogoSvg  from "../../../assets/images/Camada_1.svg";

const FotoCarteira: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Pegando os dados que vieram da tela anterior
  const dadosPrimeiraTela = route.params?.dados || {};
  //console.log(" Recebido da primeira tela:", dadosPrimeiraTela);

  const [numeroOab, setNumeroOab] = useState("");
  const [frente, setFrente] = useState<Asset | null>(null);
  const [verso, setVerso] = useState<Asset | null>(null);

  const canSubmit = useMemo(() => {
    return numeroOab.trim().length > 0 && frente !== null && verso !== null;
  }, [numeroOab, frente, verso]);

  const pickImage = async (type: "frente" | "verso") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "É preciso permitir o uso da câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (type === "frente") setFrente(asset);
      else setVerso(asset);
    }
  };

  const onSubmit = () => {
    if (!canSubmit) {
      Alert.alert(
        "Atenção",
        "Preencha o número da OAB e envie as fotos da frente e verso."
      );
      return;
    }

    const dadosCarteira = {
      oab: numeroOab,
      frente,
      verso,
    };

    navigation.navigate("CadastroEndereco", {
      dados: dadosPrimeiraTela,
      carteira: dadosCarteira,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* 🔹 Fundo SVG */}
      <View style={styles.fundoWrapper} pointerEvents="none">
        <FundoSvg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>


      // 🔹 Logo no topo
    <View style={styles.logoWrapper}>
      <LogoSvg width={200} height={150} preserveAspectRatio="xMidYMid meet" />
    </View>


      {/* 🔹 Container branco */}
      <View style={styles.containerWrapper}>
        <View style={styles.formBox}>
          <Text style={styles.headerTitle}>Carteira da OAB</Text>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Número da OAB */}
            <Text style={styles.label}>Número da OAB*</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="OAB"
                placeholderTextColor="#b8b8b8"
                style={styles.input}
                value={numeroOab}
                onChangeText={setNumeroOab}
              />
            </View>

            {/* Foto da Carteira */}
            <Text style={[styles.label, { marginTop: 16 }]}>
              Foto da Carteira*
            </Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.subLabel}>Frente</Text>
                <TouchableOpacity
                  style={styles.imageBox}
                  onPress={() => pickImage("frente")}
                >
                  {frente ? (
                    <Image
                      source={{ uri: frente.uri }}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <Text style={styles.cameraIcon}>📷</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.col}>
                <Text style={styles.subLabel}>Verso</Text>
                <TouchableOpacity
                  style={styles.imageBox}
                  onPress={() => pickImage("verso")}
                >
                  {verso ? (
                    <Image
                      source={{ uri: verso.uri }}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <Text style={styles.cameraIcon}>📷</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Avançar */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onSubmit}
              disabled={!canSubmit}
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Avançar</Text>
            </TouchableOpacity>

            {/* Voltar */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingVertical: 16 }}
            >
              <Text style={styles.backLink}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fundoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerWrapper: {
    paddingTop:50,
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  formBox: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
  },
  formScroll: {
    flexGrow: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#222",
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 18,
    justifyContent: "center",
    height: 54,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: "#111",
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    alignItems: "center",
  },
  imageBox: {
    width: 140,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  cameraIcon: {
    fontSize: 28,
    color: "#2563EB",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#2563EB",
    height: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backLink: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#111",
    fontSize: 16,
  },
logoWrapper: {
  alignItems: "center",
  marginTop: 40,  // distância do topo da tela
},

  logo: {
    width: 120, // largura da logo
    height: 80, // altura da logo
  },

});

export default FotoCarteira;
