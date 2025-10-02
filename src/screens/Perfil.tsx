import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/index";

type DadosScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Editar">;

function formatarData(data?: string) {
  if (!data) return "Não informado";

  // Se já vier no formato brasileiro, retorna direto
  if (data.includes("/")) return data;

  // Se vier no formato YYYY-MM-DD → transforma em DD/MM/YYYY
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}


export default function Dados() {
  const { usuario } = useAuth();
  const navigation = useNavigation<DadosScreenNavigationProp>();

  if (!usuario) {
    return (
      <View style={styles.loading}>
        <AppText>Carregando dados...</AppText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.header}>Dados Pessoais</AppText>

      {/* Foto e Nome */}
      <View style={styles.carteira}>
        <View style={styles.headerRow}>
          {usuario.foto && (
            <Image source={{ uri: usuario.foto }} style={styles.avatar} />
          )}
          <View style={styles.nameBlock}>
            <AppText style={styles.nome}>{usuario.nomeLogado}</AppText>
            <AppText style={styles.matricula}>OAB: {usuario.oab}</AppText>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <AppText style={styles.label}>CPF</AppText>
          <AppText style={styles.value}>{usuario.cpf}</AppText>
        </View>

        <View style={styles.infoBlock}>
          <AppText style={styles.label}>E-mail</AppText>
          <AppText style={styles.value}>{usuario.email}</AppText>
        </View>

         <View style={styles.infoBlock}>
          <AppText style={styles.label}>Data de Nascimento</AppText>
          <AppText style={styles.value}>{formatarData(usuario.dataNascimento)}
          </AppText>
        </View>

        

      </View>

      {/* Bloco maior */}
      <View style={styles.spacer} />
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Editar')}>
          <Feather name="edit" size={24} color="#173C6B" style={styles.iconEditar}/>
        </TouchableOpacity>

        <View style={styles.infoBlock}>
          <AppText style={styles.label}>Celular</AppText>
          <AppText style={styles.value}>{usuario.celular}</AppText>
        </View>

        <View style={styles.infoBlock}>
          <AppText style={styles.label}>Endereço Completo</AppText>
          <AppText style={styles.value}>
            {usuario.endereco?.enderecoCompleto ||
              `${usuario.endereco?.logradouro || ''}, ${usuario.endereco?.numero || ''}, ${usuario.endereco?.bairro || ''}${usuario.endereco?.complemento ? ', ' + usuario.endereco.complemento : ''}`}
          </AppText>
        </View>

      <View style={styles.infoBlock}>
        <AppText style={styles.label}>Cidade / UF</AppText>
        <AppText style={styles.value}>
          {usuario.endereco?.municipio} - {usuario.endereco?.uf}
        </AppText>
      </View>

      <View style={styles.infoBlock}>
        <AppText style={styles.label}>Bairro</AppText>
        <AppText style={styles.value}>{usuario.endereco?.bairro}</AppText>
      </View>

      <View style={styles.infoBlock}>
        <AppText style={styles.label}>Logradouro</AppText>
        <AppText style={styles.value}>{usuario.endereco?.logradouro}</AppText>
      </View>

      <View style={styles.infoBlock}>
        <AppText style={styles.label}>Número</AppText>
        <AppText style={styles.value}>{usuario.endereco?.numero}</AppText>
      </View>

      <View style={styles.infoBlock}>
        <AppText style={styles.label}>Complemento</AppText>
        <AppText style={styles.value}>{usuario.endereco?.complemento}</AppText>
      </View>


       
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 130,
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#e1e1e167',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#10567C',
  },
  
  carteira: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  nameBlock: {
    flexDirection: 'column',
  },
  nome: {
    fontSize: 18,
    color: '#111827',
  },
  matricula: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  spacer: {
    height: 24,
  },
  infoContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  iconEditar: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});
