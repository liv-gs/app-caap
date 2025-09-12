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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/index";

const FotoCarteira: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute();

  const [numeroOab, setNumeroOab] = useState("");
  const [frente, setFrente] = useState<Asset | null>(null);
  const [verso, setVerso] = useState<Asset | null>(null);

  const canSubmit = useMemo(() => numeroOab.trim().length > 0, [numeroOab]);

  const pickImage = (type: "frente" | "verso") => {
    launchCamera(
      { mediaType: "photo", cameraType: "back", quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            "Erro",
            response.errorMessage || "Erro ao acessar a câmera"
          );
          return;
        }
        const asset = response.assets?.[0];
        if (!asset) return;
        type === "frente" ? setFrente(asset) : setVerso(asset);
      }
    );
  };

  const onSubmit = () => {
    if (!canSubmit) {
      Alert.alert("Atenção", "Preencha o número da OAB.");
      return;
    }

    const dados = (route.params as any)?.dados;
    const endereco = (route.params as any)?.endereco;
    const carteira = {
      numeroOab,
      frente: frente?.uri ?? null,
      verso: verso?.uri ?? null,
    };

    // Navega para próxima tela, enviando os dados coletados até agora
    navigation.navigate("CadastroValidacao", { dados, endereco, carteira });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Text style={[styles.label, { marginTop: 24 }]}>
        Foto da Carteira (opcional)
      </Text>
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

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSubmit}
        disabled={!canSubmit}
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>

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
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1, justifyContent: "center" },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 6, color: "#222" },
  subLabel: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  inputWrapper: { backgroundColor: "#fff", borderRadius: 24, paddingHorizontal: 18, justifyContent: "center", height: 54, borderWidth: 1, borderColor: "#EFEFEF", marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  input: { fontSize: 16, color: "#111" },
  row: { flexDirection: "row", marginTop: 12 },
  col: { flex: 1, alignItems: "center" },
  imageBox: { width: 140, height: 90, borderRadius: 12, borderWidth: 1, borderColor: "#DDD", justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" },
  cameraIcon: { fontSize: 28, color: "#2563EB" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12, resizeMode: "cover" },
  button: { backgroundColor: "#2563EB", height: 54, borderRadius: 28, alignItems: "center", justifyContent: "center", marginTop: 32, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  buttonDisabled: { backgroundColor: "#93C5FD" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backLink: { textAlign: "center", textDecorationLine: "underline", color: "#111", fontSize: 16 },
});

export default FotoCarteira;
