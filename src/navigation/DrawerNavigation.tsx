// DrawerNavigator.tsx
import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import TabsNavigator from './TabsNavigation';

import ListaConvenio from '../screens/Convenio';
import LoginScreen from '../screens/LoginScreen';
import LogoSvg from '../../assets/images/Camada_1.svg';
import HeaderBg from '../../assets/images/FUNDO.svg';
import DadosConvenio from '../screens/DadosConvenio';
import Calendar from '../screens/agendamento';
import DadosService from '../screens/DadosService';

import { MainStackParamList } from "../types/types"; // tipagem unificada

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Componente para header background
function HeaderBackground() {
  return (
    <View style={{ position: 'absolute', top: 0, left:0, right:0, bottom:0 }}>
      <HeaderBg width="100%" height="110%" preserveAspectRatio="xMidYMid slice" />
      <View style={{ position: 'absolute', right: 12, top: 10 }}>
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
      <Stack.Screen name="DadosConvenio" component={DadosConvenio} options={{ headerShown: true }} />
      <Stack.Screen name="agendamento" component={Calendar} options={{ headerShown: true }} />
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
      <Drawer.Screen
        name="MainStack"
        component={MainStack}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route as RouteProp<Record<string, object | undefined>, string>) ?? 'Tabs';

          const hideDrawer = ['EditarDados', 'ListaDados', 'Detalhes'].includes(routeName);

          return {
            title: '',
            drawerLabel: hideDrawer ? () => null : 'Home',
            drawerItemStyle: hideDrawer ? { display: 'none' } : undefined,
            drawerIcon: hideDrawer ? () => null : ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
            swipeEnabled: !hideDrawer,
            headerShown: !hideDrawer,
          };
        }}
      />

      <Drawer.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: '',
          drawerLabel: 'Voltar para Login',
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <SimpleLineIcons name="logout" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
