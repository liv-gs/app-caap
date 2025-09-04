import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';

type Step3Prop = NativeStackNavigationProp<AuthStackParamList, 'Step3'>;

export default function Step3() {
  const navigation = useNavigation<Step3Prop>();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleFinish = () => {
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    navigation.replace('Login'); // Ou a tela principal
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Etapa 3 de 3</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro - Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressContainer: { paddingTop: 70, paddingHorizontal: 20 },
  progressBarBackground: {
    height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden',
  },
  progressBarFill: { height: 8, backgroundColor: '#12adaf' },
  progressText: { marginTop: 8, fontSize: 12, color: '#6B7280' },
  formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: {
    height: 48, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 12, marginBottom: 16, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#12adaf', paddingVertical: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
