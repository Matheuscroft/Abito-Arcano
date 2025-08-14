import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Box, Input } from "@chakra-ui/react";
import "./InputAdicionarNome.css";

interface InputAdicionarNomeProps {
  placeholder?: string;
  nomeNovo: string;
  setNomeNovo: Dispatch<SetStateAction<string>>;
  handleAddItem: () => void;
}

const InputAdicionarNome: React.FC<InputAdicionarNomeProps> = ({
  placeholder,
  nomeNovo,
  setNomeNovo,
  handleAddItem,
}) => {
  return (
    <Box>
      <Input
        placeholder={placeholder}
        value={nomeNovo}
        onChange={(e) => setNomeNovo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddItem();
          }
        }}
        size="xs"
        borderRadius="md"
        _focus={{ borderColor: "blue.400" }}
      />
    </Box>
  );
};

export default InputAdicionarNome;
