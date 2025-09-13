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
} from "react-native";
import { launchCamera, Asset } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const FotoCarteira: React.FC = () => {
  
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Pegando os dados que vieram da tela anterior
  const dadosPrimeiraTela = route.params?.dados || {};
  console.log("📤 Recebido da primeira tela:", dadosPrimeiraTela);

  const [numeroOab, setNumeroOab] = useState("");
  const [frente, setFrente] = useState<Asset | null>(null);
  const [verso, setVerso] = useState<Asset | null>(null);

  const canSubmit = useMemo(() => {
    return numeroOab.trim().length > 0 && frente !== null && verso !== null;
  }, [numeroOab, frente, verso]);

  const pickImage = async (type: "frente" | "verso") => {
    launchCamera(
      {
        mediaType: "photo",
        cameraType: "back",
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Erro", response.errorMessage || "Erro ao acessar a câmera");
          return;
        }
        const asset = response.assets?.[0];
        if (!asset) return;
        if (type === "frente") setFrente(asset);
        else setVerso(asset);
      }
    );
  };

  const onSubmit = () => {
  if (!canSubmit) {
    Alert.alert("Atenção", "Preencha o número da OAB e envie as fotos da frente e verso.");
    return;
  }

  // Em vez de criar o FormData aqui, apenas agrupe os dados
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
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text style={[styles.label, { marginTop: 24 }]}>Foto da Carteira*</Text>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.subLabel}>Frente</Text>
          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => pickImage("frente")}
          >
            {frente ? (
              <Image source={{ uri: frente.uri }} style={styles.imagePreview} />
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
              <Image source={{ uri: verso.uri }} style={styles.imagePreview} />
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
        style={{ paddingVertical: 24 }}
      >
        <Text style={styles.backLink}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
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
});

export default FotoCarteira;
