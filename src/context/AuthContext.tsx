import React, { createContext, useState, ReactNode, useContext } from "react";

// 👉 Tipagem do endereço
export type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;   // nome da cidade
  cidade: string,
  uf: string;          // sigla do estado
  cep: string;
  complemento?: string;
  enderecoCompleto: string;
  idMunicipio: number;
  idUF?: number;       // aparece no retorno de enderecoGeoCode
};

// 👉 Tipagem do usuário
export type Usuario = {
  idUsuarioLogado: number;
  nomeLogado: string;
  email: string;
  cpf: string;
  rg?: string;                 // usado no concluirCadastro
  celular: string;
  oab: string;
  validadeCarteira: string;    // "03/2025"
  foto?: string;               // "img/sem-imagem.png"
  tipo: "ADVOGADO" | "DEPENDENTE" | "CONVENIO";
  endereco?: Endereco;
  dataNascimento?: string;     // "1990-01-01" ou "01/01/1990"
  hash: string;
  validado?: number;           // 1 ou 0
  primeiroAcesso?: number;     // 1 ou 0
  titular?: Usuario | null;    // em alguns casos vem info do titular
  colaborador?: number;        // 0 ou 1
  senha?: string;              // só quando alterar
  dependentes?: Usuario[];     // se quiser já mapear o retorno de listarDependentes
  [key: string]: any;
};


// 👉 Tipagem do contexto
interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario) => void;
  clearUsuario: () => void;
  loginAdvogado: (cpf: string, senha: string) => Promise<Usuario>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);

  const setUsuario = (usuario: Usuario) => {
    setUsuarioState(usuario);
  };

  const clearUsuario = () => {
    setUsuarioState(null);
  };

  const loginAdvogado = async (cpf: string, senha: string) => {
    const data = await loginAdvogado(cpf, senha);

    if (data.ok) {
      const usuarioLogado: Usuario = {
        ...data.usuario,
        hash: data.usuario.hash,
        idUsuarioLogado: data.usuario.idUsuarioLogado,
      };
      setUsuario(usuarioLogado);
      return usuarioLogado;
    } else {
      throw new Error(data.erro || "Erro ao logar");
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, clearUsuario, loginAdvogado }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};