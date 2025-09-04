import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import Step1 from '../screens/cadastro/Step1';
import Step2 from '../screens/cadastro/Step2';
import Step3 from '../screens/cadastro/Step3';
import DrawerNavigator from '../navigation/DrawerNavigation';


export type AuthStackParamList = {
  Login: undefined;
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Step1" component={Step1} options={{ headerShown: false }}/>
      <Stack.Screen name="Step2" component={Step2} options={{ headerShown: false }}/>
      <Stack.Screen name="Step3" component={Step3} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}