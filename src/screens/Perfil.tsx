import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import AppText from '../components/AppText';

export default function Perfil() {
  const backgroundImage = require('../../assets/images/foto1.png');
  const backgroundImage2 = require('../../assets/images/foto2.png');
  
  const [foto, setFoto] = useState<string | null>(null);

  const tirarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
        <AppText style={styles.header}>Carteira Virtual</AppText>
      <ImageBackground
        source={backgroundImage}
        style={styles.carteirinha}
        imageStyle={styles.fundoImagem}
      >
        {/* Logo pequena */}
        <ImageBackground
          source={backgroundImage2}
          style={styles.logoPequena}
          imageStyle={styles.logoImageStyle}
        />

        <View style={styles.topo}>
          <TouchableOpacity style={styles.foto} onPress={tirarFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.imagemFoto} />
            ) : (
              <Feather name="camera" size={24} color="#888" />
            )}
          </TouchableOpacity>

          <View style={styles.info}>
            <AppText style={styles.nome}>
              Levi Ronniele Gonçalves dos santos
            </AppText>
          </View>
        </View>

        {/* QR code ilustrativo */}
    

        <View style={styles.dadosBaixo}>
          <AppText style={styles.dadoTexto}>Validade: 12/2025</AppText>
          <AppText style={styles.dadoTexto}>Matrícula: 123456</AppText>
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
    fontWeight: '500',
    fontSize: 22,
    marginBottom: 40,
    paddingTop: 20,
    color: '#5a5f6aff',
  },
  carteirinha: {
    width: 360,
    height: 210,
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
  topo: {
    flexDirection: 'row',
    margin: 2,
  },
  foto: {
    width: 80,
    height: 100,
    backgroundColor: '#ddd',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagemFoto: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  info: {
    marginLeft: 8,
    paddingTop: 50,
    maxWidth: 250,
  },
  nome: {
    fontSize: 18,
    color: '#dededeff',
    flexWrap: 'wrap',
  },
  logoPequena: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoImageStyle: {
    borderRadius: 8,
  },
  dadosBaixo: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    alignItems: 'flex-end',
  },
  dadoTexto: {
    fontSize: 14,
    color: '#dededeff',
  },
  qrCode: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    width: 50,
    height: 50,
  },
});