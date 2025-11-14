// DrawerNavigator.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, SimpleLineIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';

import TabsNavigator from './TabsNavigation';

import ListaConvenio from '../screens/Convenio';
import LoginScreen from '../screens/LoginScreen';
import DadosConvenio from '../screens/DadosConvenio';
import DadosMedico from '../screens/DadosMedico';
import Calendar from '../screens/agendamento';
import DadosService from '../screens/DadosService';
import Home from '../screens/Home';
import AlterarSenha from '../screens/AlterarSenha';

// 🔵 IMPORTS NOVOS
import ListarDependente from "../screens/listarDepedente";
import CadastroDependente from "../screens/cadastroDepedente";

import LogoSvg from '../../assets/images/Camada_1.svg';
import HeaderBg from '../../assets/images/FUNDO.svg';

import { MainStackParamList } from "../types/types";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

function HeaderBackground() {
  return (
    <View style={{ position: 'absolute', top: 0, left:0, right:0, bottom:0 }}>
      <HeaderBg width="100%" height="110%" preserveAspectRatio="xMidYMid slice" />
      <View style={{ position: 'absolute', right: 12, top: 25 }}>
        <LogoSvg width={100} height={100} />
      </View>
    </View>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: () => <HeaderBackground />,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
      }}
    >

      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: true }} />
      <Stack.Screen name="DadosService" component={DadosService} options={{ headerShown: true }} />
      <Stack.Screen name="DadosMedico" component={DadosMedico} options={{ headerShown: true }} />
      <Stack.Screen name="DadosConvenio" component={DadosConvenio} options={{ headerShown: true }} />
      <Stack.Screen name="agendamento" component={Calendar} options={{ headerShown: true }} />
    
      <Stack.Screen name="CadastroDependente" component={CadastroDependente} options={{ headerShown: true }} />

    </Stack.Navigator>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerBackground: () => <HeaderBackground />,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        drawerStyle: { backgroundColor: '#f3f1f1ff' },
        drawerActiveTintColor: '#0D3B66',
        drawerInactiveTintColor: '#0D3B66',
        headerTintColor: '#fff',
      }}
    >

      {/* HOME */}
      <Drawer.Screen
        name="MainStack"
        component={MainStack}
        options={({ navigation, route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route as RouteProp<Record<string, object | undefined>, string>) ?? 'Tabs';
          const hideDrawer = ['EditarDados', 'ListaDados', 'Detalhes'].includes(routeName);

          return {
            title: '',
            drawerLabel: hideDrawer
              ? () => null
              : () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Tabs", { screen: "Home" })}>
                    <Text style={{ color: "#0D3B66", fontSize: 16 }}>Home</Text>
                  </TouchableOpacity>
                ),
            drawerItemStyle: hideDrawer ? { display: 'none' } : undefined,
            drawerIcon: hideDrawer
              ? () => null
              : ({ color, size }) => <Feather name="home" color={color} size={size} />,
            swipeEnabled: !hideDrawer,
            headerShown: !hideDrawer,
          };
        }}
      />

      {/* 🔵 LISTAR DEPENDENTES NO MENU */}
      <Drawer.Screen
        name="ListarDependente"
        component={ListarDependente}
        options={({ navigation }) => ({
          title: '',
          drawerLabel: "Listar Dependentes",
          headerShown: false, 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        })}
      />

      {/* ALTERAR SENHA */}
      <Drawer.Screen
        name="AlterarSenha"
        component={AlterarSenha}
        options={{
          drawerLabel: "Alterar Senha",
          headerShown: false,
          drawerIcon: ({ color, size }) => <MaterialIcons name="lock-reset" color={color} size={size} />
        }}
      />

      {/* SAIR */}
      <Drawer.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: '',
          drawerLabel: 'Sair',
          headerShown: false,
          drawerIcon: ({ color, size }) => <SimpleLineIcons name="logout" color={color} size={size} />,
        }}
      />

    </Drawer.Navigator>
  );
}
