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
import FormData from "form-data"; // ✅ importa para usar form-data
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/index"; 
import FundoSvg from "../../../assets/images/FUNDO.svg";

import LogoSvg  from "../../../assets/images/Camada_1.svg";
type FormDadosNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  "CadastroDados"
>;

// ------------------------
// helpers de máscara/validação
// ------------------------
const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatDateForApi = (date: string) => {
  // assume que date está em "dd/mm/yyyy"
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`; // "2005-01-14"
};

const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  const base = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)]
    .filter(Boolean)
    .join(".");
  let rest = d.slice(9, 11);
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

  // 🔹 Erros dinâmicos
const [emailError, setEmailError] = useState<string | null>(null);
const [cpfError, setCpfError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | undefined>();

  // Validação em tempo real
  const passwordsMatch = useMemo(
    () => senha.length > 0 && senha === confirma,
    [senha, confirma]
  );

  // Validação de formulário
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
  }, [nome, cpf, passwordsMatch, nascimento, celular, email, lgpdOk, email]);

const onSubmit = async () => {
  setEmailError(null);
  setCpfError(null);

  if (!canSubmit) {
    Alert.alert("Atenção", "Preencha todos os campos obrigatórios corretamente.");
    return;
  }

  try {
    const data = new FormData();
    data.append("cpf", onlyDigits(cpf));
    data.append("email", email);
    data.append("dataNascimento", formatDateForApi(nascimento));

    const config = {
      method: "post" as const,
      maxBodyLength: Infinity,
      url: "https://caapi.org.br/appcaapi/api/verificarCadastro",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    };

    const response = await axios.request(config);
    console.log("Resposta API:", response.data);

    if (response.data?.erro) {
      // ✅ Bloqueia a navegação e mostra o erro
      Alert.alert("Atenção", response.data.erro);

      if (response.data.erro.toLowerCase().includes("e-mail")) {
        setEmailError(response.data.erro);
      }
      if (response.data.erro.toLowerCase().includes("cpf")) {
        setCpfError(response.data.erro);
      }

      return; // 🔥 NÃO NAVEGA
    }

    // Se não houver erro → navega
    navigation.navigate("CadastroCarteira", {
      dados: { nome, cpf, email, nascimento, rg, celular, senha },
    });
  } catch (error: any) {
    console.error("Erro ao verificar cadastro:", error);
    Alert.alert("Erro", "Não foi possível verificar o cadastro. Tente novamente.");
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.fundoWrapper} pointerEvents="none">
        <FundoSvg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>

        <View style={styles.logoWrapper}>
      <LogoSvg width={200} height={120} preserveAspectRatio="xMidYMid meet" />
    </View>

      <View style={styles.containerWrapper}>
        <View style={styles.formBox}>
          <Text style={styles.headerTitle}>Dados Pessoais</Text>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <LabeledInput
              label="Nome Completo"
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              error={nome.trim().length > 0 && nome.trim().length < 3 ? "Digite o nome completo" : undefined}
            />

            <LabeledInput
              label="CPF"
              placeholder="Digite seu CPF"
              value={cpf}
              onChangeText={(t) => {
                setCpf(maskCPF(t));
                if (isValidCPF(t)) setCpfError(undefined);
              }}
              keyboardType="numeric"
              error={cpfError}
            />

            <View style={styles.row}>
              <View style={[styles.col, { marginRight: 8 }]}>
                <LabeledInput
                  label="Senha"
                  placeholder="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />
              </View>
              <View style={[styles.col, { marginLeft: 8 }]}>
                <LabeledInput
                  label="Confirma Senha"
                  placeholder="Confirme"
                  value={confirma}
                  onChangeText={setConfirma}
                  secureTextEntry
                  error={
                    confirma.length > 0 && !passwordsMatch
                      ? "Senhas não conferem"
                      : undefined
                  }
                />
              </View>
            </View>

            <LabeledInput label="RG"
             placeholder="Digite seu RG"
             value={rg} onChangeText={setRg} 
             />

            <LabeledInput
              label="Data de nascimento"
              placeholder="dd/mm/aaaa"
              value={nascimento}
              onChangeText={(t) => setNascimento(maskDate(t))}
              keyboardType="numeric"
              error={
                nascimento.length > 0 && nascimento.length < 10
                  ? "Data inválida"
                  : undefined
              }
            />

            <LabeledInput
              label="Celular"
               placeholder="Digite seu número"
              value={celular}
              onChangeText={(t) => setCelular(maskPhoneBR(t))}
              keyboardType="phone-pad"
              error={
                onlyDigits(celular).length > 0 && onlyDigits(celular).length < 10
                  ? "Número inválido"
                  : undefined
              }
            />

            <LabeledInput
              label="E-mail*"
              placeholder="seuemail@email.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (emailRegex.test(t)) setEmailError(undefined);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            {/* LGPD */}
            <View style={styles.lgpdRow}>
              <Checkbox checked={lgpdOk} onToggle={() => setLgpdOk((v) => !v)} />
              <Text style={styles.lgpdText}>
                Declaro estar ciente da utilização dos Dados na extensão
                autorizada na Lei Geral de Proteção de Dados – LGPD.
              </Text>
            </View>

            {/* Erro da API */}
            {apiError && <Text style={styles.apiError}>{apiError}</Text>}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onSubmit}
              disabled={!canSubmit}
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Avançar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
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
    <View style={[styles.inputWrapper, error && styles.inputError]}>
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
  fundoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerWrapper: {
    flex: 1,
   paddingTop:10,
    alignItems: "center", // centraliza horizontalmente
    paddingHorizontal: 16,
  },
  formBox: {
    width: "100%",
    maxHeight: "90%", // 🔹 controla a altura para não colar no final
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  formScroll: {
    flexGrow: 0,
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
    marginBottom: 8,
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
  apiError: {
  color: "#E11D48",
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 12,
  textAlign: "center",
},
inputError: {
  borderColor: "#E11D48", // Vermelho
  shadowColor: "#E11D48", // Sombra leve vermelha
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
},
logoWrapper: {
  alignItems: "center",
  marginTop: 40,  // distância do topo da tela
},

  logo: {
    width: 120, // largura da logo
    height: 80, // altura da logo
  },


});


export default FormDados;
