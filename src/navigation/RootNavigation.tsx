import { useAuth } from "../context/AuthContext";
import AuthStack from "./index"; // stack do login
import DrawerNavigator from "./DrawerNavigation";

export default function RootNavigator() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <AuthStack />; 
  }

  return <DrawerNavigator />; 
}
