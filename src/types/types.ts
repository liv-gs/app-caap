import type { ApiService } from "../types/ApiService";
import type { Usuario } from "../types/Usuario";

export type MainStackParamList = {
  Tabs: undefined;
  Service: undefined;

  DadosService: { service: ApiService };

  DadosConvenio: {
    convenio: {
      id: number;
      nome: string;
      descricao: string;
      imagem_destacada?: string | null;
      usuario: Usuario;
      tipo: string;
    };
  };

  agendamento: { service: ApiService }; // ✅ agora recebe igual DadosService
};

// Tipos dos cards de serviço
export type CardProps = Pick<ApiService, "id" | "title" | "description" | "icon" | "imagem_destacada">;

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
