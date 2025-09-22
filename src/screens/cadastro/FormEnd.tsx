import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  KeyboardTypeOptions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import FormData from "form-data";
import { AuthStackParamList } from "../../navigation/index";
import FundoSvg from "../../../assets/images/FUNDO.svg";
import LogoSvg  from "../../../assets/images/Camada_1.svg";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


// 🔹 Tipagem do Input
type InputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: KeyboardTypeOptions;
};


// 🔹 Tipagem da rota
type CadastroEnderecoRouteProp = RouteProp<
  AuthStackParamList,
  "CadastroEndereco"
>;

export async function fileToBase64(uri: string) {
  try {
    return await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
  } catch (err) {
    console.error("Erro ao converter para base64:", err);
    return null;
  }
}

// Helpers
const onlyDigits = (v: string) => v.replace(/\D/g, "");
const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
};

// Dados fixos para exemplo
const estados = ["PI", "MA", "CE", "BA"];
const cidadesPorEstado: Record<string, string[]> = {
  PI: ["Teresina", "Parnaíba", "Picos"],
  MA: ["São Luís", "Imperatriz"],
  CE: ["Fortaleza", "Juazeiro do Norte"],
  BA: ["Salvador", "Feira de Santana"],
};

const FormEnd: React.FC = () => {
const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  
  const route = useRoute<CadastroEnderecoRouteProp>();
  const { dados, carteira } = route.params;



 console.log("========================================");
  console.log("📥 RECEBIDO NA TELA DE ENDEREÇO");
  console.log("➡️ Dados Pessoais:", dados);
  console.log("➡️ Dados Carteira:", {
    oab: carteira?.oab,
    frente: carteira?.frente?.uri || "❌ não recebida",
    verso: carteira?.verso?.uri || "❌ não recebida",
  });
  console.log("========================================");


  // Estados locais
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const formatDateForApi = (date: string) => {
  // assume que date está em "dd/mm/yyyy"
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`; // "2005-01-14"
};
  // Validação do botão
  const canSubmit = useMemo(() => {
    return (
      cep.length === 9 &&
      !!estado &&
      !!cidade &&
      bairro.trim().length > 0 &&
      logradouro.trim().length > 0 &&
      numero.trim().length > 0
    );
  }, [cep, estado, cidade, bairro, logradouro, numero]);

  const onSubmit = async () => {
  if (!canSubmit) {
    Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const data = new FormData();
    const frenteBase64 = carteira?.frente?.uri
      ? await fileToBase64(carteira.frente.uri)
      : null;

    const versoBase64 = carteira?.verso?.uri
      ? await fileToBase64(carteira.verso.uri)
      : null;

    // 🔹 Dados pessoais
    data.append("nome", dados.nome);
    data.append("cpf", dados.cpf);
    data.append("email", dados.email);
    data.append("senha", dados.senha);
    data.append("dataNascimento", formatDateForApi(dados.nascimento));
    data.append("rg", dados.rg);
    data.append("celular", dados.celular);

    // 🔹 Dados da carteira
    data.append("oab", carteira.oab);
    data.append("oabFrente", frenteBase64 || "");
    data.append("oabVerso", versoBase64 || "");

    // 🔹 Endereço
    data.append("cep", cep);
    data.append("estado", estado || "");
    data.append("cidade", cidade || "");
    data.append("bairro", bairro);
    data.append("logradouro", logradouro);
    data.append("numero", numero);
    data.append("complemento", complemento);

    const headers = (data as any).getHeaders?.() ?? {
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(
      "https://caapi.org.br/appcaapi/api/concluirCadastro",
      data,
      { headers }
    );

    console.log("Resposta API:", response.data);

    Alert.alert("Sucesso", "Cadastro concluído!", [
      {
        text: "OK",
        onPress: () => navigation.replace("CadastroValidacao"),
      },
    ]);
  } catch (error: any) {
    console.error("Erro ao enviar cadastro:", error?.response?.data || error);
    Alert.alert(
      "Erro",
      "Não foi possível concluir o cadastro. Verifique os dados e tente novamente."
    );
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

    {/* 🔹 Wrapper para centralizar */}
    <View style={styles.containerWrapper}>
      {/* 🔹 Caixa do formulário com altura controlada */}
      <View style={styles.formBox}>
        <Text style={styles.headerTitle}>Endereço</Text>

        {/* 🔹 Scroll interno só para os campos */}
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LabeledInput
            label="CEP*"
            placeholder="00000-000"
            value={cep}
            onChangeText={(t) => setCep(maskCEP(t))}
            keyboardType="numeric"
          />
          <LabeledInput
            label="Estado*"
            placeholder="Digite o estado"
            value={estado ?? ""}
            onChangeText={(t) => {
              setEstado(t);
              setCidade(null);
            }}
          />
          <LabeledInput
            label="Cidade*"
            placeholder="Digite a cidade"
            value={cidade ?? ""}
            onChangeText={setCidade}
          />
          <LabeledInput label="Bairro*" value={bairro} onChangeText={setBairro} />
          <LabeledInput
            label="Logradouro*"
            value={logradouro}
            onChangeText={setLogradouro}
          />
          <LabeledInput
            label="Número*"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
          />
          <LabeledInput
            label="Complemento"
            value={complemento}
            onChangeText={setComplemento}
          />
        </ScrollView>

        {/* 🔹 Botão fixo dentro do container */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
);

};

// 🔹 Componente de input tipado
const LabeledInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
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
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

// 🔹 estilos
const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    alignItems: "center", // centraliza horizontalmente
    paddingHorizontal: 16,
  },
  formBox: {
    width: "100%",
    maxHeight: "85%", // 🔹 controla a altura para não colar no rodapé
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
    marginBottom: 12, // espaço para o botão não sobrepor os campos
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
  logoWrapper: {
  alignItems: "center",
  marginTop: 40,  // distância do topo da tela
},

  logo: {
    width: 120, // largura da logo
    height: 80, // altura da logo
  },
    fundoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});


export default FormEnd;
