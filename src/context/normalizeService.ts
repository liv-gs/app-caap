// utils/normalizeService.ts
import { ApiService } from "../types/ApiService";
import { Usuario } from "../types/Usuario";

export function normalizeService(apiData: any, usuario?: Usuario): ApiService {
  // normalizar horários
  let horarios: string[] = [];
  if (Array.isArray(apiData.horarios)) {
    horarios = apiData.horarios;
  } else if (typeof apiData.horarios === "string" && apiData.horarios.trim() !== "") {
    horarios = apiData.horarios.split(",").map((h: string) => h.trim());
  }

  // normalizar dias
  let dias: number[] = [];
  if (Array.isArray(apiData.dias)) {
    dias = apiData.dias.map((d: string | number) => Number(d));
  } else if (typeof apiData.dias === "string" && apiData.dias.trim() !== "") {
    dias = apiData.dias.split(",").map((d: string) => Number(d));
  }

  // garantir content como string
  const content = typeof apiData.content === "string" ? apiData.content : null;

  return {
    id: apiData.id,
    title: apiData.titulo ?? "",
    description: apiData.resumo ?? content ?? "",
    imagem_destacada: apiData.imagem_destacada ?? "", // 🔹 agora vem da API
    usuario: usuario ?? (apiData.usuario as Usuario),
    content,
    tipo: apiData.diaria ? "hotel" : horarios.length > 0 ? "salao" : "outro",
    horarios,
    diaria: Boolean(apiData.diaria),
    dias,
    link: apiData.link ?? "",
  };
}
