import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginAdvogado as apiLoginAdvogado, setUsuarioLogado } from "../api/api";



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

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario) => void;
  clearUsuario: () => void;
  loginAdvogado: (cpf: string, senha: string) => Promise<Usuario>;
  logout: () => Promise<void>; // ✅
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);



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

  //  Carrega usuário salvo ao abrir o app
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const userStorage = await AsyncStorage.getItem("@usuario");
        if (userStorage) {
          setUsuarioState(JSON.parse(userStorage));
        }
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, []);

  // Salva usuário
  const setUsuario = async (usuario: Usuario) => {
    setUsuarioState(usuario);
    await AsyncStorage.setItem("@usuario", JSON.stringify(usuario));
  };

  // Logout
  const clearUsuario = async () => {
    setUsuarioState(null);
    await AsyncStorage.removeItem("@usuario");
  };

  const logout = async () => {
  setUsuarioState(null);
  await AsyncStorage.removeItem("@usuario_logado");
};


  // 🔹 Login 
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
