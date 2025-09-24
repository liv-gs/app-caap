// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react";
import { loginAdvogado as apiLoginAdvogado, setUsuarioLogado } from "../api/api";

// 👉 Tipagem do endereço
export type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string; // nome da cidade
  uf: string;        // sigla do estado
  cep: string;
  complemento?: string;
  enderecoCompleto: string;
  idMunicipio: number;
  idUF?: number;
};

export type Usuario = {
  idUsuarioLogado: number;
  nomeLogado: string;
  email: string;
  cpf: string;
  rg?: string;
  celular: string;
  oab: string;
  validadeCarteira: string;
  foto?: string;
  tipo: "ADVOGADO" | "DEPENDENTE" | "CONVENIO";
  endereco?: Endereco;
  dataNascimento?: string;
  hash: string;
  validado?: number;
  primeiroAcesso?: number;
  titular?: Usuario | null;
  colaborador?: number;
  senha?: string;
  dependentes?: Usuario[];
  cep?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  enderecoCompleto?: string;
  uf?: string;
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

// Função para padronizar dados do usuário
const padronizarUsuario = (usuario: any): Usuario => {
  return {
    ...usuario,
    cep: usuario.endereco?.cep || "",
    cidade: usuario.endereco?.municipio || "",
    bairro: usuario.endereco?.bairro || "",
    logradouro: usuario.endereco?.logradouro || "",
    numero: usuario.endereco?.numero || "",
    complemento: usuario.endereco?.complemento || "",
    enderecoCompleto: usuario.endereco?.enderecoCompleto || "",
    uf: usuario.endereco?.uf || "",
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);

  const setUsuario = (usuario: Usuario) => {
    setUsuarioState(usuario);
  };

  const clearUsuario = () => {
    setUsuarioState(null);
  };

  const loginAdvogado = async (cpf: string, senha: string) => {
    const data = await apiLoginAdvogado(cpf, senha);

    if (data?.usuario) {
      const usuarioLogado = padronizarUsuario(data.usuario);
      setUsuario(usuarioLogado);
      await setUsuarioLogado(usuarioLogado);
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
