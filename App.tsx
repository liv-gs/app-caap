import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";

import AuthStack from "./src/navigation";
import { AuthProvider } from "./src/context/AuthContext";


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      
      if (fontsLoaded) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); 
        setAppReady(true);
        await SplashScreen.hideAsync(); 
      }
    };
    prepare();
  }, [fontsLoaded]);

  if (!appReady) {
    return null; 
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
