// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginAdvogado as apiLoginAdvogado, setUsuarioLogado } from "../api/api";

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
  idUF?: number;
};

// 👉 Tipagem do usuário
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
  setUsuario: (usuario: Usuario) => Promise<void>;
  clearUsuario: () => Promise<void>;
  loginAdvogado: (cpf: string, senha: string) => Promise<Usuario>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 👉 Função para padronizar dados do usuário
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
  const [loading, setLoading] = useState(true);

  // 🔄 Carregar usuário salvo ao abrir o app
  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const usuarioStorage = await AsyncStorage.getItem("@usuario");

        if (usuarioStorage) {
          setUsuarioState(JSON.parse(usuarioStorage));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsuario();
  }, []);

  // 💾 Salvar usuário no estado + AsyncStorage
  const setUsuario = async (usuario: Usuario) => {
    setUsuarioState(usuario);
    await AsyncStorage.setItem("@usuario", JSON.stringify(usuario));
  };

  // 🚪 Logout — limpa tudo
  const clearUsuario = async () => {
    setUsuarioState(null);
    await AsyncStorage.removeItem("@usuario");
  };

  // 🔐 Login advogado
  const loginAdvogado = async (cpf: string, senha: string) => {
    const data = await apiLoginAdvogado(cpf, senha);

    if (data?.usuario) {
      const usuarioLogado = padronizarUsuario(data.usuario);

      await setUsuario(usuarioLogado);
      await setUsuarioLogado(usuarioLogado);

      return usuarioLogado;
    } else {
      throw new Error(data?.erro || "Erro ao logar");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        clearUsuario,
        loginAdvogado,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 👉 Hook para consumir o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
