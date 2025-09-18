// utils/normalizeService.ts
import { ApiService } from "../types/ApiService";

export function normalizeService(apiData: any): ApiService {
  // normalizar horarios
  let horarios: string[] = [];
  if (Array.isArray(apiData.horarios)) {
    horarios = apiData.horarios; // já é array
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

  return {
    id: apiData.id,
    title: apiData.titulo,
    description: apiData.resumo ?? apiData.content ?? null,
    icon: "calendar", // ajusta conforme seu caso
    usuario: {} as any, // você injeta pelo contexto
    content: apiData.content ?? null,

    tipo: apiData.diaria ? "hotel" : horarios.length > 0 ? "salao" : "outro",

    horarios,
    diaria: Boolean(apiData.diaria),
    dias,
  };
}
