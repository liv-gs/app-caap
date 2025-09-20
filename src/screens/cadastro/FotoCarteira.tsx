import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const UploadFotoPerfil: React.FC<{ cpf: string }> = ({ cpf }) => {
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const enviarFoto = async () => {
    if (!foto) {
      Alert.alert("Atenção", "Escolha ou tire uma foto primeiro.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("cpf", cpf); // 🔑 identifica o usuário
      data.append("fotoPerfil", {
        uri: foto,
        type: "image/jpeg",
        name: "perfil.jpg",
      } as any);

      const response = await axios.post(
        "https://caapi.org.br/appcaapi/api/salvarFotoPerfil",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data?.sucesso) {
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } else {
        Alert.alert("Erro", response.data?.erro || "Não foi possível salvar a foto.");
        console.log("Resposta API:", response.data);
      }
    } catch (err: any) {
      console.error("Erro upload:", err?.response?.data || err.message);
      Alert.alert("Erro", "Falha ao enviar a foto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {foto && <Image source={{ uri: foto }} style={styles.preview} />}

      <TouchableOpacity style={styles.button} onPress={escolherFoto}>
        <Text style={styles.buttonText}>Escolher da Galeria</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={tirarFoto}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2563EB" }]}
        onPress={enviarFoto}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Enviar Foto"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  preview: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#2563EB",
  },
  button: {
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 6,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default UploadFotoPerfil;
