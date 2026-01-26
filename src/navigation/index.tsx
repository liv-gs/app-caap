import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

// Telas
import LoginScreen from "../screens/LoginScreen";
import EscolhaTipoScreen from "../screens/cadastro/Escolha";
import FormDados from "../screens/cadastro/DadosPessoais";
import FotoCarteira from "../screens/cadastro/FotoCarteira";
import FormEnd from "../screens/cadastro/FormEnd";
import Validação from "../screens/cadastro/Validacao";
import EditarDados from "../screens/Editar";
import RecuperarSenha from "../screens/recuperarSenha";
import DrawerNavigator from "./DrawerNavigation";

export type AuthStackParamList = {
  Login: undefined;
  EscolhaTipo: undefined;
  CadastroDados: { tipo: "advogado" | "colaborador" };
  CadastroCarteira: { dados: any };
  CadastroEndereco: { dados: any; carteira: any };
  CadastroValidacao: undefined;
  Home: undefined;
  Editar: undefined;
  RecuperarSenha: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const [loading, setLoading] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  useEffect(() => {
    const verificarLogin = async () => {
      const usuario = await AsyncStorage.getItem("@usuario");
      if (usuario) {
        setUsuarioLogado(true);
      }
      setLoading(false);
    };

    verificarLogin();
  }, []);

  // ⏳ enquanto verifica o storage
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuarioLogado ? (
        // 🔒 Já logado → entra direto no app
        <Stack.Screen name="Home" component={DrawerNavigator} />
      ) : (
        // 🔓 Não logado → fluxo normal
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
          <Stack.Screen name="EscolhaTipo" component={EscolhaTipoScreen} />
          <Stack.Screen name="CadastroDados" component={FormDados} />
          <Stack.Screen name="CadastroCarteira" component={FotoCarteira} />
          <Stack.Screen name="CadastroEndereco" component={FormEnd} />
          <Stack.Screen name="CadastroValidacao" component={Validação} />
        
        </>
      )}
    </Stack.Navigator>
  );
}
