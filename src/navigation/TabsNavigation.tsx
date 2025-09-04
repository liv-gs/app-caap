import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Feather} from '@expo/vector-icons'
import Home from '../screens/Home';
import Service from '../screens/Service';
import Carteirinha from '../screens/Carteirinha';
import Convenio from '../screens/Convenio';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Perfil from '../screens/Perfil'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false,  
      tabBarShowLabel: true, 
      tabBarActiveTintColor: '#1E3A8A', 
      tabBarInactiveTintColor: '#9CA3AF'}} >

      <Tab.Screen name='Home' 
      component={Home} 
      options={{
        tabBarIcon: ({color, size}) => <Entypo name="home" size={24} color={color} />
      }}  
      />
      <Tab.Screen name='Serviços' 
      component={Service}
      options={{
        tabBarIcon: ({color, size}) => <FontAwesome6 name="briefcase" size={size} color={color}/>
      }}
       />
      <Tab.Screen name='Convenio' 
      component={Convenio}
      options={{
        tabBarIcon: ({color, size}) => <FontAwesome name="handshake-o" size={size} color={color}/>
      }}
       />
      <Tab.Screen name='Carteirinha' 
      component={Carteirinha}
      options={{
        tabBarIcon: ({color, size}) =><FontAwesome name="id-card-o" size={size} color={color}/>
      }}
       />
      <Tab.Screen name='Perfil' 
      component={Perfil}
      options={{
        tabBarIcon: ({color, size}) => <FontAwesome5 name="user-alt" size={size} color={color} />
      }}
       />
    </Tab.Navigator>
  );
}