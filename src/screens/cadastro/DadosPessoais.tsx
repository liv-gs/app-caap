import React, { useMemo, useState } from "react";
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
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/index"; 

type FormDadosNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CadastroDados"
>;

export type RootStackParamList = {
  CadastroDados: undefined;
  CadastroCarteira: {
    dados: {
      nome: string;
      cpf: string;
      email: string;
      nascimento: string;
      rg: string;
      celular: string;
    };
  };
  CadastroEndereco: undefined;
};

// ------------------------
// helpers de máscara/validação
// ------------------------
const onlyDigits = (v: string) => v.replace(/\D/g, "");

const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  const parts = [];
  if (d.length > 3) parts.push(d.slice(0, 3));
  if (d.length > 6) parts.push(d.slice(3, 6));
  if (d.length > 9) parts.push(d.slice(6, 9));
  let rest = d.slice(9, 11);
  const base = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)]
    .filter(Boolean)
    .join(".");
  return base + (rest ? "-" + rest : d.length > 9 ? "-" : "");
};

const maskDate = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

const maskPhoneBR = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)})${d.slice(2)}`;
  return `(${d.slice(0, 2)})${d.slice(2, 7)}-${d.slice(7)}`;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const isValidCPF = (cpfMasked: string) => {
  const d = onlyDigits(cpfMasked);
  return d.length === 11;
};

// ------------------------
// checkbox simples
// ------------------------
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
const navigation = useNavigation<FormDadosNavProp>();


  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [rg, setRg] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [lgpdOk, setLgpdOk] = useState(false);


  const passwordsMatch = useMemo(
    () => senha.length > 0 && senha === confirma,
    [senha, confirma]
  );

  const canSubmit = useMemo(() => {
    return (
      nome.trim().length >= 3 &&
      isValidCPF(cpf) &&
      passwordsMatch &&
      nascimento.length === 10 &&
      onlyDigits(celular).length >= 10 &&
      emailRegex.test(email) &&
      lgpdOk 
    
    );
  }, [nome, cpf, passwordsMatch, nascimento, celular, email, lgpdOk,]);

const onSubmit = () => {
  if (!canSubmit) {
    Alert.alert("Atenção", "Preencha todos os campos obrigatórios corretamente.");
    return;
  }
  
  navigation.navigate("CadastroCarteira", {
    dados: {
      nome,
      cpf,
      email,
      nascimento,
      rg,
      celular,
      senha, // ✅ adicionei a senha aqui
    },
  });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>Cadastro</Text>

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
          onChangeText={(t) => setCpf(maskCPF(t))}
          keyboardType="numeric"
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
              error={confirma.length > 0 && !passwordsMatch ? "Senhas não conferem" : undefined}
            />
          </View>
        </View>

        <LabeledInput label="RG*" placeholder="Digite seu RG" value={rg} onChangeText={setRg} />
        <LabeledInput
          label="Data de nascimento*"
          placeholder="dd/mm/AAAA"
          value={nascimento}
          onChangeText={(t) => setNascimento(maskDate(t))}
          keyboardType="numeric"
        />
        <LabeledInput
          label="Celular*"
          placeholder="(99)99999-9999"
          value={celular}
          onChangeText={(t) => setCelular(maskPhoneBR(t))}
          keyboardType="phone-pad"
        />
        <LabeledInput
          label="E-mail*"
          placeholder="seuemail@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        

        {/* LGPD */}
        <View style={styles.lgpdRow}>
          <Checkbox checked={lgpdOk} onToggle={() => setLgpdOk((v) => !v)} />
          <Text style={styles.lgpdText}>
            Declaro estar ciente da utilização dos Dados na extensão autorizada
            na Lei Geral de Proteção de Dados – LGPD.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ------------------------
// Input com rótulo + erro
// ------------------------
type LabeledInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?:
    | "default"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, error && { borderColor: "#E11D48" }]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#b8b8b8"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ------------------------
// Estilos
// ------------------------
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
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
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 6,
    color: "#E11D48",
    fontSize: 13,
  },
});

export default FormDados;
