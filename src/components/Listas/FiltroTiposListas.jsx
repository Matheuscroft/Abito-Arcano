import React, { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';

const FiltroTiposListas = ({ listas, onFilterChangeTipo }) => {
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [tiposDisponiveis, setTiposDisponiveis] = useState([]);

  useEffect(() => {
    const tiposUnicos = [...new Set(listas?.map(lista => lista.tipo))];
    setTiposDisponiveis(tiposUnicos);
  }, [listas]);

  const toggleTipo = (tipo) => {
    let updatedSelectedTipos;
    if (selectedTipos.includes(tipo)) {
      updatedSelectedTipos = selectedTipos.filter(t => t !== tipo);
    } else {
      updatedSelectedTipos = [...selectedTipos, tipo];
    }
    setSelectedTipos(updatedSelectedTipos);
    onFilterChangeTipo(updatedSelectedTipos);
  };

  return (
    <Box my={5}>
      {tiposDisponiveis.map(tipo => (
        <Button
          key={tipo}
          onClick={() => toggleTipo(tipo)}
          border={selectedTipos.includes(tipo) ? '2px solid #333' : '1px solid #ccc'}
          backgroundColor={selectedTipos.includes(tipo) ? '#333' : 'transparent'}
          color={selectedTipos.includes(tipo) ? '#000' : '#fff'}
          padding="8px"
          margin="5px"
          borderRadius="5px"
          cursor="pointer"
          _hover={{ opacity: 0.8 }}
        >
          {tipo.toUpperCase()}
        </Button>
      ))}
    </Box>
  );
};

export default FiltroTiposListas;
