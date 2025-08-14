import React, { useState } from "react";
import "./FormBotoesEditarEDelete.css";
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

const FormBotoesEditarEDelete = ({ item, onEdit, onDelete, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuRoot isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          as={IconButton}
          aria-label="Opções"
          size="xs"
        >
          <Icon color="pink.700">
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
};

export default FormBotoesEditarEDelete;
