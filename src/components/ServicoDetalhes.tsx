// components/ServicoDetalhes.tsx
import React from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

type ServicoDetalhesProps = {
  titulo: string;
  resumo: string;
  imagem_destacada?: string | null;
  content: string;
  dias?: string[];
  horarios?: string[];
};

export default function ServicoDetalhes({
  titulo,
  resumo,
  imagem_destacada,
  content,
  dias = [],
  horarios = [],
}: ServicoDetalhesProps) {
  // Sanitiza o HTML para evitar scripts maliciosos
  const safeContent = DOMPurify.sanitize(content);

  return (
    <div className="servico-container">
      {/* Título */}
      <h1 className="servico-titulo">{titulo}</h1>

      {/* Resumo */}
      <p className="servico-resumo">{resumo}</p>

      {/* Imagem destacada */}
      {imagem_destacada && (
        <img
          src={imagem_destacada}
          alt={titulo}
          className="servico-imagem"
        />
      )}

      {/* Conteúdo HTML */}
      <div className="servico-content">{parse(safeContent)}</div>

      {/* Dias disponíveis */}
      {dias.length > 0 && (
        <div className="servico-dias">
          <h3>Dias disponíveis:</h3>
          <ul>
            {dias.map((dia, index) => (
              <li key={index}>{dia}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Horários disponíveis */}
      {horarios.length > 0 && (
        <div className="servico-horarios">
          <h3>Horários disponíveis:</h3>
          <ul>
            {horarios.map((hora, index) => (
              <li key={index}>{hora}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
