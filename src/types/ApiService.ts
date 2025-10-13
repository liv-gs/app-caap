// types/ApiService.ts
import { Feather } from "@expo/vector-icons";
import { Usuario } from "./Usuario";

export type ApiService = {
  id: number;
  title: string; 
  description: string;

  imagem_destacada?: string; // nome igual ao da API
  usuario: Usuario;

  tipo: "hotel" | "salao" | "outro"; 

  horarios: string[]; 
  diaria: boolean; 
  dias: number[]; 
  link?: string;
  content?: string | null;
  titulo?:string;
  pai?:string;
  resumo?:string;
};
