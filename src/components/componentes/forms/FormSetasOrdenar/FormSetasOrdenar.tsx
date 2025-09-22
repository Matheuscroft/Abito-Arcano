import React, { useEffect } from "react";
import "./FormSetasOrdenar.css";
import { HStack, IconButton } from "@chakra-ui/react";
import { IoChevronDownCircle, IoChevronUpCircle } from "react-icons/io5";
import type { ItemResponse } from "@/types/item";
import type { CompletedTaskResponseDTO } from "@/types/task";

interface FormSetasOrdenarProps {
  item: ItemResponse | CompletedTaskResponseDTO;
  lista: (ItemResponse | CompletedTaskResponseDTO)[] | { itens?: (ItemResponse | CompletedTaskResponseDTO)[] };
  onMove: (item: ItemResponse | CompletedTaskResponseDTO, direction: number) => void;
}

const hStackProps = {
  spacing: 1,
  align: "center",
} as const;

const FormSetasOrdenar: React.FC<FormSetasOrdenarProps> = ({ onMove, item, lista }) => {
  useEffect(() => {
    // console.log("Item atualizado:", item);
  }, [item]);

  const index = Array.isArray(lista)
    ? lista.findIndex(i => i.id === item.id)
    : lista.itens?.findIndex(i => i.id === item.id) ?? 0;

  const listaLength = Array.isArray(lista)
    ? lista.length
    : lista.itens?.length ?? 0;

  return (
    <HStack {...hStackProps}>
      <IconButton
        onClick={() => onMove(item, -1)}
        disabled={index === 0} 
        size="xs"
        variant="surface"
        aria-label="Mover para cima"
      >
        <IoChevronUpCircle />
      </IconButton>

      <IconButton
        onClick={() => onMove(item, 1)}
        disabled={index === listaLength - 1} 
        size="xs"
        variant="surface"
        aria-label="Mover para baixo"
      >
        <IoChevronDownCircle />
      </IconButton>
    </HStack>
  );
};

export default FormSetasOrdenar;
