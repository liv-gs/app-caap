import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';

// Importe sua stack de navegação
import AuthStack from './src/navigation'; // ajuste o caminho conforme seu projeto

export default function App() {
  // Carrega a fonte Poppins-Regular ou outras que quiser
  const [fontsLoaded] = useFonts({
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
  });

  if (!fontsLoaded) {
    return null; // ou um AppLoading/Splash personalizado
  }

  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}
