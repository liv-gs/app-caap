// navigation/types.ts
import { Feather } from "@expo/vector-icons";

// Tipos dos parâmetros do Stack principal
export type MainStackParamList = {
  Tabs: undefined;
  Service: undefined;

  DadosService: {
    service: {
      id: number;
      title: string;
      description: string;
      imagem_destacada?: string | null;
      icon: keyof typeof Feather.glyphMap;
    };
  };

  DadosConvenio: {
    convenio: {
      id: number;
      nome: string;
      descricao: string;
      imagem_destacada?: string | null;
    };
  };

  agendamento: undefined;
};

type Props = {
  usuario: Usuario;
};
// Tipos dos cards de serviço
export type CardProps = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap; // ícone do Feather
  imagem_destacada?: string | null;
};

// Tipos de outro fluxo de formulários
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
