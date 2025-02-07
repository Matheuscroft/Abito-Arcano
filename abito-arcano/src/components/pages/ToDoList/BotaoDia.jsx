import { Card, Heading } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

const BotaoDia = ({ data, diaSemana, isSelecionado, onClick }) => {

  const cardRef = useRef(null);

  useEffect(() => {
    if (isSelecionado && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isSelecionado]);

  const formatarDiaSemana = (diaSemana) => {
    const abreviacoes = {
      "segunda-feira": "SEG",
      "terça-feira": "TER",
      "quarta-feira": "QUA",
      "quinta-feira": "QUI",
      "sexta-feira": "SEX",
      sábado: "SAB",
      domingo: "DOM",
    };
    return abreviacoes[diaSemana.toLowerCase()] || diaSemana;
  };

  return (
    <div ref={cardRef}>
      <Card.Root
        size="sm"
        onClick={onClick}
        style={{
          cursor: "pointer",
          backgroundColor: isSelecionado ? "#711515" : "#683939",
          border: isSelecionado ? "2px solid #000" : "1px solid #ccc",
          textAlign: "center",
        }}
      >
        <Card.Body>
          <Heading size="sm">{data}</Heading>
          <div style={{ fontSize: "9px" }}>{formatarDiaSemana(diaSemana)}</div>
        </Card.Body>
      </Card.Root>
    </div>
  );
};

export default BotaoDia;
