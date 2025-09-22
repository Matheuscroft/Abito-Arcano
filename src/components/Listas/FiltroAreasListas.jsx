import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

const FiltroAreasListas = ({ areas, onFilterChange }) => {
  const [selectedAreas, setSelectedAreas] = useState(areas);

  const toggleArea = (areaId) => {
    let updatedSelectedAreas;
    if (selectedAreas.includes(areaId)) {
      updatedSelectedAreas = selectedAreas.filter(id => id !== areaId);
    } else {
      updatedSelectedAreas = [...selectedAreas, areaId];
    }
    setSelectedAreas(updatedSelectedAreas);
    onFilterChange(updatedSelectedAreas);
  };

  return (
    <Box mt={5}>
      {areas.map(area => (
        <Button
        key={area.id}
        onClick={() => toggleArea(area.id)}
        border={selectedAreas.includes(area.id) ? `2px solid ${area.cor}` : '1px solid #ccc'}
        backgroundColor={
          area.nome === "SEM CATEGORIA"
            ? selectedAreas.includes(area.id) ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
            : selectedAreas.includes(area.id) ? area.cor : 'transparent'
        }
        color={selectedAreas.includes(area.id) ? '#fff' : area.cor}
        padding="8px"
        margin="5px"
        borderRadius="5px"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        >
          {area.nome}
        </Button>
      ))}
    </Box>
  );
};

export default FiltroAreasListas;
