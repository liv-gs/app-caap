// src/api/auth.ts

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
  return response.json();
};

// Sessão (opcional se não quiser AsyncStorage)
// Aqui só uma forma de guardar dados em memória se quiser
let usuarioLogado: any = null;

export const setUsuarioLogado = (usuario: any) => {
  usuarioLogado = usuario;
};

export const getUsuarioLogado = () => usuarioLogado;

export const clearUsuarioLogado = () => {
  usuarioLogado = null;
};
