import { getHash, getUsuarioLogado } from "./api";

const API_URL = "https://appcaapi.caapi.org.br/api/";

export const apiRequest = async (
  endpoint: string,
  params: Record<string, any> = {},
  auth: boolean = true
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (auth) {
    const usuario = await getUsuarioLogado();
    const hash = await getHash();
    if (!usuario || !hash) throw new Error("Sessão inválida");

    headers["hash"] = hash;
    headers["idUsuarioLogado"] = String(usuario.idUsuarioLogado);
  }

  const body = new URLSearchParams(params).toString();

  const response = await fetch(API_URL + endpoint, {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) throw new Error("Erro de conexão com servidor");
  const data = await response.json();

  if (data?.erro) {
    throw new Error(data.erro);
  }

  return data;
};
