import React, { createContext, useState, ReactNode, useContext } from "react";

// 👉 Tipagem do endereço
export type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  complemento?: string;
  enderecoCompleto: string;
  idMunicipio: number;
};

// 👉 Tipagem do usuário
export type Usuario = {
  idUsuarioLogado: number;
  nomeLogado: string;
  email: string;
  cpf: string;
  celular: string;
  oab: string;
  validadeCarteira: string;
  foto?: string;
  tipo: string;
  endereco?: Endereco;
};

// 👉 Tipagem do contexto
type AuthContextType = {
  usuario: Usuario | null;
  setUsuario: (user: Usuario | null) => void;
};

// 👉 Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 👉 Provider que vai envolver toda a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// 👉 Hook para usar o contexto em qualquer tela
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
