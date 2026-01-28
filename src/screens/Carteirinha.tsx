import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { useAuth } from '../context/AuthContext';
import { getHash, getUsuarioLogado } from '../api/api'; 
import * as ImageManipulator from 'expo-image-manipulator';


const API_BASE_URL = 'https://appcaapi.caapi.org.br/api/';

export default function Carteirinha() {
  const backgroundImage = require('../../assets/images/carteira.png');
  const { usuario, setUsuario } = useAuth();
  const [fotoLocal, setFotoLocal] = useState<string | null>(usuario?.foto || null);
  const [base64Foto, setBase64Foto] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(usuario?.hash || null);
  const [idUsuario, setIdUsuario] = useState<number | null>(usuario?.idUsuarioLogado || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarSessao = async () => {
      if (!hash) {
        const savedHash = await getHash();
        setHash(savedHash);
      }
      if (!idUsuario) {
        const savedUser = await getUsuarioLogado();
        if (savedUser) {
          setIdUsuario(savedUser.idUsuarioLogado);
        }
      }
    };
    carregarSessao();
  }, []);

  function formatarData(data?: string) {
  if (!data) return "Não informado";

  
  if (data.includes("/")) return data;

 
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}




  const tirarFoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [4, 4],
    quality: 0.8,
    base64: false,
  });

  if (result.canceled) return;

  try {
    const originalUri = result.assets[0].uri;

    const manipulated = await ImageManipulator.manipulateAsync(
      originalUri,
      [{ resize: { width: 600 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!manipulated.base64) {
      Alert.alert("Erro", "Não foi possível processar a foto.");
      return;
    }

    const base64ComPrefixo = manipulated.base64.startsWith("data:")
      ? manipulated.base64
      : `data:image/jpeg;base64,${manipulated.base64}`;

    setFotoLocal(manipulated.uri);
    setBase64Foto(base64ComPrefixo);

    await enviarFoto(base64ComPrefixo, manipulated.uri);
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
    Alert.alert("Erro", "Falha ao processar a imagem.");
  }
};



  const enviarFoto = async (base64: string | null, uri: string) => {
    if (!base64) {
      Alert.alert("Atenção", "Não foi possível processar a foto.");
      return;
    }
    if (!hash || !idUsuario) {
      Alert.alert("Erro", "Não foi possível identificar o usuário logado.");
      return;
    }

    try {
      setLoading(true);

      console.log("Enviando foto para API...");
      console.log("hash:", hash);
      console.log("idUsuarioLogado:", idUsuario);
      console.log("base64Foto (100 chars):", base64.substring(0, 100));

      const response = await fetch(`${API_BASE_URL}salvarFotoPerfil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          hash: hash,
          idUsuarioLogado: idUsuario.toString(),
        },
        body: new URLSearchParams({ foto: base64 }).toString(),
      });

      const text = await response.text();
      console.log("RETORNO RAW:", text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        Alert.alert("Erro", "Resposta inválida do servidor.");
        return;
      }


      if (data.ok) {
  Alert.alert("Sucesso", data.ok);

    if (usuario) {
      setUsuario({
        ...usuario,
        foto: data.foto, 
      });
    }
  }else {
        Alert.alert("Erro", data.erro || "Não foi possível salvar a foto.");
      }
    } catch (err: any) {
      console.error("Erro upload:", err?.response?.data || err.message);
      Alert.alert("Erro", "Falha ao enviar a foto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <View style={styles.container}>
        <AppText>Carregando carteira...</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Carteira Virtual</AppText>
      <ImageBackground
        source={backgroundImage}
        style={styles.carteirinha}
        imageStyle={styles.fundoImagem}
      >
        {/* Foto */}
        <TouchableOpacity style={styles.foto} onPress={tirarFoto}>
          {fotoLocal || usuario.foto ? (
            <Image source={{ uri: fotoLocal || usuario.foto }} style={styles.imagemFoto} />
          ) : (
            <Feather name="camera" size={24} color="#888" />
          )}
        </TouchableOpacity>

     
        <View style={styles.info}>
          <AppText style={styles.profissao}>{usuario.tipo}</AppText>
          <AppText style={styles.nome}>{usuario.nomeLogado}</AppText>

      
          <View style={styles.dadosBaixo}>
             <AppText style={styles.dadoTexto}>
              Data de Nascimento: {formatarData(usuario.dataNascimento)}
            </AppText>
             <AppText style={styles.dadoTexto}>Inscrição: {usuario.oab}</AppText>

            <AppText style={styles.dadoTexto}>Validade: {usuario.validadeCarteira}</AppText>
          
  
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e1e167',
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 22,
    marginBottom: 40,
    paddingTop: 20,
    color: '#10567C',
  },
  carteirinha: {
    width: 360,
    height: 260,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fundoImagem: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
  foto: {
    width: 65,
    height: 80,
    backgroundColor: '#ddd',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  imagemFoto: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  info: {
    paddingTop: 5,
    alignItems: 'flex-start',
  },
  profissao: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dededeff',
    marginBottom: 2,
  },
  nome: {
    fontSize: 18,
    color: '#58b4d3ff',
    marginBottom: 6,
  },
  dadosBaixo: {
    paddingTop: 5,
    alignItems: 'flex-start',
  },
  dadoTexto: {
    fontSize: 14,
    color: '#dededeff',
  },
});
