import type { ApiService } from "../types/ApiService";
import type { Usuario } from "../types/Usuario";





export type MainStackParamList = {
  Tabs: undefined;
  Service: undefined;
  Categorias: undefined;
  DadosService: { service: ApiService };
  DadosMedico: { service: ApiService };
  DadosConvenio: { categoria: string }; 
  agendamento: { service: ApiService };
  ListarDependente: undefined;
  CadastroDependente: undefined;
  Editar: undefined;
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

export type DrawerParamList = {
  MainStack: undefined;
  ListarDependente: undefined;
  AlterarSenha: undefined;
  Logout: undefined;
};
