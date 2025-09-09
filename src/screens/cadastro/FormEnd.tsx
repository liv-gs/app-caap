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
} from "react-native";

// ------------------------
// helpers
// ------------------------
const onlyDigits = (v: string) => v.replace(/\D/g, "");
const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return d.slice(0, 5) + "-" + d.slice(5);
};

// lista exemplo — em produção você buscaria via API
const estados = ["PI", "MA", "CE", "BA"];
const cidadesPorEstado: Record<string, string[]> = {
  PI: ["Teresina", "Parnaíba", "Picos"],
  MA: ["São Luís", "Imperatriz"],
  CE: ["Fortaleza", "Juazeiro do Norte"],
  BA: ["Salvador", "Feira de Santana"],
};

// ------------------------
const FormEnd: React.FC = () => {
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const canSubmit = useMemo(() => {
    return (
      cep.length === 9 &&
      estado !== null &&
      cidade !== null &&
      bairro.trim().length > 0 &&
      logradouro.trim().length > 0 &&
      numero.trim().length > 0
    );
  }, [cep, estado, cidade, bairro, logradouro, numero]);

  const onSubmit = () => {
    if (!canSubmit) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    // aqui você chamaria sua API
    Alert.alert("Sucesso", "Endereço cadastrado!");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* CEP */}
        <LabeledInput
          label="CEP*"
          placeholder="00000-000"
          value={cep}
          onChangeText={(t) => setCep(maskCEP(t))}
          keyboardType="numeric"
        />

        {/* Estado */}
        <TouchableOpacity
          style={styles.selectWrapper}
          onPress={() => {
            Alert.alert("Selecione Estado", "", [
              ...estados.map((uf) => ({
                text: uf,
                onPress: () => {
                  setEstado(uf);
                  setCidade(null);
                },
              })),
              { text: "Cancelar", style: "cancel" },
            ]);
          }}
        >
          <Text style={styles.label}>Estado*</Text>
          <Text style={styles.selectText}>{estado ?? "Selecione"}</Text>
        </TouchableOpacity>

        {/* Cidade */}
        <TouchableOpacity
          style={styles.selectWrapper}
          disabled={!estado}
          onPress={() => {
            if (!estado) return;
            Alert.alert("Selecione Cidade", "", [
              ...(cidadesPorEstado[estado] || []).map((c) => ({
                text: c,
                onPress: () => setCidade(c),
              })),
              { text: "Cancelar", style: "cancel" },
            ]);
          }}
        >
          <Text style={styles.label}>Cidade*</Text>
          <Text style={styles.selectText}>
            {cidade ?? (estado ? "Selecione" : "-")}
          </Text>
        </TouchableOpacity>

        {/* Bairro */}
        <LabeledInput
          label="Bairro*"
          placeholder="Seu bairro"
          value={bairro}
          onChangeText={setBairro}
        />

        {/* Logradouro */}
        <LabeledInput
          label="Logradouro (Rua, Avenida ou etc..)*"
          placeholder="Logradouro"
          value={logradouro}
          onChangeText={setLogradouro}
        />

        {/* Número */}
        <LabeledInput
          label="Número*"
          placeholder="Nº"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />

        {/* Complemento */}
        <LabeledInput
          label="Complemento"
          placeholder="Complemento"
          value={complemento}
          onChangeText={setComplemento}
        />

        {/* Botão Concluir */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>

        {/* Voltar */}
        <TouchableOpacity
          onPress={() => Alert.alert("Voltar", "Ir para tela anterior")}
          style={{ paddingVertical: 24 }}
        >
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ------------------------
// Componente input
// ------------------------
type InputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

const LabeledInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
}) => {
  return (
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
};

// ------------------------
// estilos
// ------------------------
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
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
  selectWrapper: {
    marginBottom: 16,
  },
  selectText: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 18,
    height: 54,
    textAlignVertical: "center",
    textAlign: "left",
    lineHeight: 54,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  button: {
    backgroundColor: "#2563EB",
    height: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
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
  backLink: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#111",
    fontSize: 16,
  },
});

export default FormEnd;
