import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function DadosService({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
    
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.title}>CAAP + Físio</Text>
          {/* Imagem Centralizada */}
          <Image
              source={require('../../assets/images/foto1.png')} 
            style={styles.image}
            resizeMode="cover"
          />

          {/* Título sobre o local */}
          <Text style={styles.title}>Nome do Local</Text>

          {/* Detalhamento grande */}
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
            consequat magna. Phasellus ullamcorper, lorem sit amet elementum
            fermentum, nisl urna posuere odio, sed tristique justo elit nec leo.
            Vivamus pharetra, lorem non volutpat tincidunt, nulla purus
            sollicitudin mi, et dictum libero nibh non mi. Curabitur in lorem
            sit amet urna ultricies sagittis. Praesent ut eros at mauris
            pellentesque cursus. Duis vel massa quis nulla efficitur varius.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Agendamento")}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Ir para Agendamento</Text>
            <AntDesign name="arrowright" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop:100,
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between", // força o botão ficar no fim
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D3B66",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 30,
  },
button: {
  backgroundColor: "#0D3B66",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},

buttonContent: {
  flexDirection: "row",   // faz o texto e a seta ficarem lado a lado
  alignItems: "center",   // alinha verticalmente
},
buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},


});
