// types/ApiService.ts
import { Feather } from "@expo/vector-icons";
import { Usuario } from "./Usuario";

export type ApiService = {
  id: number;
  title: string; // vem de "titulo"
  description: string; // vem de "resumo" ou "content" (dependendo do uso)
  imagem_destacada?: string | null; // vem de "imagem_destacada"
  icon: keyof typeof Feather.glyphMap;
  usuario: Usuario;

  tipo: "hotel" | "salao" | "outro"; // mapeado conforme serviço

  horarios: string[]; // sempre array (mesmo que vazio [])
  diaria: boolean; // sempre boolean (false se não vier)
  dias: number[]; // sempre array de dias da semana [0=Dom, 1=Seg, ...]
};
