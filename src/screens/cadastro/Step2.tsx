import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';

type Step2Prop = NativeStackNavigationProp<AuthStackParamList, 'Step2'>;

export default function Step2() {
  const navigation = useNavigation<Step2Prop>();

  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');

  const handleNext = () => {
    navigation.navigate('Step3');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '66%' }]} />
        </View>
        <Text style={styles.progressText}>Etapa 2 de 3</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro - Endereço</Text>

        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <TextInput
          style={styles.input}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={bairro}
          onChangeText={setBairro}
        />

        <TextInput
          style={styles.input}
          placeholder="Complemento"
          value={complemento}
          onChangeText={setComplemento}
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
