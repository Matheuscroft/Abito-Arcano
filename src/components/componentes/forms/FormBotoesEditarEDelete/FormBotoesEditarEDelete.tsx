import React, { useState } from "react";
import {
  Button,
  Icon,
  IconButton,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ItemResponse } from "@/types/item";
import type { CompletedTaskResponseDTO } from "@/types/task";

interface FormBotoesEditarEDeleteProps {
  item: ItemResponse | CompletedTaskResponseDTO;
  index?: number;
  onEdit: (item: ItemResponse | CompletedTaskResponseDTO) => void;
  onDelete: () => void;
}

function FormBotoesEditarEDelete({
  item,
  onEdit,
  onDelete,
}: FormBotoesEditarEDeleteProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          as={IconButton}
          aria-label="Opções"
          size="xs"
        >
          <Icon>
            <BsThreeDotsVertical color="pink.700" />
          </Icon>
        </Button>
      </MenuTrigger>

      <MenuContent>
        <MenuItem
          value="editar"
          onClick={() => {
            onEdit(item);
            setIsOpen(false);
          }}
        >
          Editar
        </MenuItem>

        <MenuItem
          value="excluir"
          onClick={() => {
            onDelete();
            setIsOpen(false);
          }}
          color="red.500"
        >
          Excluir
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}

export default FormBotoesEditarEDelete;
