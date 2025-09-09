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
