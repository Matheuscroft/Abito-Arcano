import React, { useEffect } from "react";
import "./FormSetasOrdenar.css";
import { Button, HStack, IconButton, VStack } from "@chakra-ui/react";
import { IoChevronDownCircle, IoChevronUpCircle } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
const FormSetasOrdenar = ({ onMove, item, lista }) => {
  useEffect(() => {
    //console.log("CONSOLE LOG DO FORMSETASORDENAR. ITEM:");
    //console.log(item);
  }, [item]);

  return (
    <HStack spacing={1}>
        
      <IconButton
        onClick={() => onMove(item, -1)}
        isDisabled={item?.id === 0}
        size="xs"
        variant="surface"
      >
        <IoChevronUpCircle />
        
      </IconButton>
      
      <IconButton 
        onClick={() => onMove(item, 1)} 
        isDisabled={item?.id === (lista?.itens?.length || lista?.length) - 1}
        size="xs"
        variant="surface"
      >
        <IoChevronDownCircle />
        </IconButton>
    </HStack>
  );
};

export default FormSetasOrdenar;
