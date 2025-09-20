// src/api/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Funções de API usando fetch ---
// Obs: todas retornam JSON e lançam erro se não der certo

// Verificar cadastro antes de concluir (ex: validação de CPF/OAB)
export const verificarCadastro = async (dados: any) => {
  const response = await fetch("https://caapi.org.br/appcaapi/api/verificarCadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!response.ok) throw new Error("Erro ao verificar cadastro");
  return response.json();
};

// Concluir cadastro com dados do usuário, endereço e carteira
export const concluirCadastro = async (dados: any) => {
  const response = await fetch("https://caapi.org.br/appcaapi/api/concluirCadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!response.ok) throw new Error("Erro ao concluir cadastro");
  return response.json();
};

// Login do advogado
export const loginAdvogado = async (cpf: string, senha: string) => {
  const formData = new FormData();
  formData.append("cpf", cpf);
  formData.append("senha", senha);

  const response = await fetch("https://caapi.org.br/appcaapi/api/logarAdvogado", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Erro de conexão com servidor");
  const data = await response.json();

  // Se logou certo, guardamos o usuário e o hash
  if (data?.usuario) {
    await setUsuarioLogado(data.usuario);
  }

  return data;
};

// ---------------- Sessão ----------------

// aqui vai ficar em memória também (pra acesso rápido)
let usuarioLogado: any = null;

// salvar em memória + storage
export const setUsuarioLogado = async (usuario: any) => {
  usuarioLogado = usuario;
  await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
  if (usuario.hash) {
    await AsyncStorage.setItem("hash", usuario.hash);
  }
};

// recuperar usuário da memória ou do storage
export const getUsuarioLogado = async () => {
  if (usuarioLogado) return usuarioLogado;
  const saved = await AsyncStorage.getItem("usuario");
  if (saved) {
    usuarioLogado = JSON.parse(saved);
    return usuarioLogado;
  }
  return null;
};

// recuperar só o hash
export const getHash = async (): Promise<string | null> => {
  const hash = await AsyncStorage.getItem("hash");
  return hash;
};

// limpar sessão
export const clearUsuarioLogado = async () => {
  usuarioLogado = null;
  await AsyncStorage.removeItem("usuario");
  await AsyncStorage.removeItem("hash");
};
