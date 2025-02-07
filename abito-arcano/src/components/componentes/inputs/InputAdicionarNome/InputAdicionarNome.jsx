import React from 'react';
import './InputAdicionarNome.css';
import { Box, Input } from '@chakra-ui/react';

const InputAdicionarNome = ({ placeholder, nomeNovo, setNomeNovo, handleAddItem }) => {
  

  return (
    <Box>
      <Input
        placeholder={placeholder}
        value={nomeNovo}
        onChange={(e) => setNomeNovo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddItem();
          }
        }}
        size="xs"
        borderRadius="md"
        focusBorderColor="blue.400"
      />
    </Box>
  );
};

export default InputAdicionarNome;
