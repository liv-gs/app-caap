// utils.ts
export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const formatDateFromApi = (date: string) => {
  if (!date || date === "0000-00-00" || !date.includes("-")) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

export const maskPhoneBR = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)})${d.slice(2)}`;
  return `(${d.slice(0, 2)})${d.slice(2, 7)}-${d.slice(7)}`;
};

export const normalizeUserData = (usuario: any) => {
  return {
    ...usuario,
    cpf: onlyDigits(usuario.cpf || ""),
    celular: maskPhoneBR(usuario.celular || ""),
    dataNascimento: formatDateFromApi(usuario.dataNascimento),
    nome: usuario.nomeLogado || usuario.nome || "",
    email: usuario.email || "",
    tipo: usuario.tipo || "",
    oab: usuario.oab || "",
    endereco: usuario.endereco || {},
  };
};
