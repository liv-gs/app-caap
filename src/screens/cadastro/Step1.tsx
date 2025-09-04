import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';

type Step1Prop = NativeStackNavigationProp<AuthStackParamList, 'Step1'>;

export default function Step1() {
  const navigation = useNavigation<Step1Prop>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleNext = () => {
    navigation.navigate('Step2');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '33%' }]} />
        </View>
        <Text style={styles.progressText}>Etapa 1 de 3</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro - Dados Pessoais</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Próxima Etapa</Text>
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
