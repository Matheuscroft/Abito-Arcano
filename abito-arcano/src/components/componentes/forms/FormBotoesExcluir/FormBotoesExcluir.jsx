import React, { useState } from "react";
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

const FormBotoesExcluir = ({ item, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuRoot isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          as={IconButton}
          aria-label="Opções"
          size="xs"
          position="absolute"
          top="10px"
          right="10px"
        >
          <Icon color="pink.700">
            <BsThreeDotsVertical color="pink.700" />
          </Icon>
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          value="excluir"
          onClick={() => {
            onDelete(item.id);
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

export default FormBotoesExcluir;