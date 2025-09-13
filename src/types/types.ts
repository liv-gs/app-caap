import { Feather } from "@expo/vector-icons"; // Ícones

// types.ts
export type RootStackParamList = {
  Categorias: undefined;
  DadosConvenio: { categoria: string };
};


// types.ts
export type MainStackParamList = {
  Service: undefined;
  DadosService: { service: { title: string; description: string } }; // ← aqui
  DadosConvenio: undefined;
  Tabs: undefined;
};



type CardProps = {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap; // nome do ícone Feather
};


export type ParametroDados = {
  FormDados: undefined;
  OabCarteira: {
    nome: string;
    cpf: string;
    email: string;
    nascimento: string;
    rg: string;
    celular: string;
  };
  Endereco: undefined;
};