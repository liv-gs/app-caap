import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/index";
import FundoSvg from "../../../assets/images/FUNDO.svg";





function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function Checkbox({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[styles.checkbox, checked && styles.checkboxChecked]}
    >
      {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
    </TouchableOpacity>
  );
}


// ------------------------
// Tela principal
// ------------------------
const FormDados: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [rg, setRg] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [lgpdOk, setLgpdOk] = useState(false);
  const [loading, setLoading] = useState(false);

const onSubmit = () => {
  console.log("Botão clicado");

  // Validação

  if (!cpf) return showAlert("Erro", "Preencha o CPF");

  // Formatar CPF no padrão 000.000.000-00
  const cpfNumeros = cpf.replace(/\D/g, "");
  const cpfFormatado = cpfNumeros.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );

  const formDados = {
    nome,
    email,
    cpf: cpfFormatado,
    celular,
    rg,
    dataNascimento: nascimento,
    senha,
    colaborador: 0, // ou 1 se for colaborador
  };

  console.log("➡️ Indo para próxima etapa:", formDados);

  // Redirecionar sem verificar API
  if ((route.params as any)?.tipo === "advogado") {
    navigation.navigate("CadastroCarteira", { dados: formDados });
  } else {
    navigation.navigate("CadastroEndereco", {
      dados: formDados,
      carteira: null,
    });
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Fundo */}
      <FundoSvg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={styles.fundosvg}
      />

      

      {/* Container branco fixo */}
      <View style={styles.formContainer}>
        {/* Scroll apenas no conteúdo */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cadastro</Text>
          </View>

          {/* Inputs */}
          <LabeledInput
            label="Nome Completo*"
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <LabeledInput
            label="CPF*"
            placeholder="Digite seu CPF"
            value={cpf}
            onChangeText={setCpf}
          />
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 8 }]}>
              <LabeledInput
                label="Senha*"
                placeholder="Digite uma Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>
            <View style={[styles.col, { marginLeft: 8 }]}>
              <LabeledInput
                label="Confirma Senha*"
                placeholder="Confirme a Senha"
                value={confirma}
                onChangeText={setConfirma}
                secureTextEntry
              />
            </View>
          </View>
          <LabeledInput
            label="RG*"
            placeholder="Digite seu RG"
            value={rg}
            onChangeText={setRg}
          />
          <LabeledInput
            label="Data de nascimento*"
            placeholder="dd/mm/AAAA"
            value={nascimento}
            onChangeText={setNascimento}
          />
          <LabeledInput
            label="Celular*"
            placeholder="(99)99999-9999"
            value={celular}
            onChangeText={setCelular}
          />
          <LabeledInput
            label="E-mail*"
            placeholder="seuemail@email.com"
            value={email}
            onChangeText={setEmail}
          />

          {/* LGPD */}
          <View style={styles.lgpdRow}>
            <Checkbox checked={lgpdOk} onToggle={() => setLgpdOk(!lgpdOk)} />
            <Text style={styles.lgpdText}>
              Declaro estar ciente da utilização dos Dados na extensão autorizada
              na Lei Geral de Proteção de Dados Pessoais – LGPD.
            </Text>
          </View>

          {/* Botão Avançar */}
          <TouchableOpacity activeOpacity={0.9} onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Avançar</Text>
          </TouchableOpacity>

          {/* Link Voltar */}
          <TouchableOpacity
            onPress={() => Alert.alert("Voltar", "Ir para a tela de login")}
            style={{ paddingVertical: 24 }}
          >
            <Text style={styles.backLink}>Voltar para login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

// ------------------------
// Input com rótulo
// ------------------------
type LabeledInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
};

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#b8b8b8"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  </View>
);

// ------------------------
// Styles
// ------------------------
const styles = StyleSheet.create({
  fundosvg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  formContainer: {
    flex: 1,
    margin: 25,
    marginTop:100,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#222",
    fontWeight: "500",
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 18,
    justifyContent: "center",
    height: 54,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: "#111",
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
  },
  lgpdRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  lgpdText: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#c7c7c7",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkboxMark: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#2563EB",
    height: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backLink: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#111",
    fontSize: 16,
  },
});

export default FormDados;
