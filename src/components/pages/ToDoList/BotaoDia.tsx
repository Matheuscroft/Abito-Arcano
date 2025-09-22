import { Card, Heading } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

interface BotaoDiaProps {
  date: string;
  dayOfWeek: number;
  isSelected: boolean;
  onClick: () => void;
}

const BotaoDia: React.FC<BotaoDiaProps> = ({
  date,
  dayOfWeek,
  isSelected,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isSelected]);

  const formatarDiaSemana = (dayOfWeek: number) => {
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return dias[dayOfWeek - 1];
  };

  const formatarData = (dataIso: string): string => {
    const [ano, mes, dia] = dataIso.split("-");
    if (!ano || !mes || !dia) {
      throw new Error("Data inválida, esperado formato YYYY-MM-DD");
    }
    return `${dia}/${mes}/${ano.slice(2)}`;
  };

  return (
    <div ref={cardRef}>
      <Card.Root
        size="sm"
        onClick={onClick}
        style={{
          cursor: "pointer",
          backgroundColor: isSelected ? "#711515" : "#683939",
          border: isSelected ? "2px solid #000" : "1px solid #ccc",
          textAlign: "center",
        }}
      >
        <Card.Body>
          <Heading size="sm">{formatarData(date)}</Heading>
          <div style={{ fontSize: "9px" }}>{formatarDiaSemana(dayOfWeek)}</div>
        </Card.Body>
      </Card.Root>
    </div>
  );
};

export default BotaoDia;
