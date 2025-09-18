// types/ApiService.ts
import { Feather } from "@expo/vector-icons";
import { Usuario } from "./Usuario";

export type ApiService = {
  id: number;
  title: string; 
  description: string;

  icon: keyof typeof Feather.glyphMap;
  usuario: Usuario;

  tipo: "hotel" | "salao" | "outro"; // mapeado conforme serviço

  horarios: string[]; 
  diaria: boolean; 
  dias: number[]; 
  link?: string;
  content?: string | null
};
