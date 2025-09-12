import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Telas
import LoginScreen from "../screens/LoginScreen";
import EscolhaTipoScreen from "../screens/cadastro/Escolha";
import FormDados from "../screens/cadastro/DadosPessoais";
import FotoCarteira from "../screens/cadastro/FotoCarteira";
import FormEnd from "../screens/cadastro/FormEnd";
import Validação from "../screens/cadastro/Validacao";
import DrawerNavigator from "./DrawerNavigation";

export type AuthStackParamList = {
  Login: undefined;
  EscolhaTipo: undefined;

  // comum
  CadastroDados: { tipo: "advogado" | "colaborador" };

  // advogado
  CadastroCarteira: { dados: any };
  FormEnd: { dados: any; carteira: { oab: string; frente: string; verso: string } };
  CadastroEndereco: { dados: any; carteira: any };

  // validação (comum aos dois)
  CadastroValidacao: undefined;

  // pós login
  Home: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EscolhaTipo" component={EscolhaTipoScreen} />

      {/* comum */}
      <Stack.Screen name="CadastroDados" component={FormDados} />

      {/* advogado */}
      <Stack.Screen name="CadastroCarteira" component={FotoCarteira} />
      <Stack.Screen name="CadastroEndereco" component={FormEnd} />

      {/* tela final */}
      <Stack.Screen name="CadastroValidacao" component={Validação} />

      {/* pós login */}
      <Stack.Screen name="Home" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}
