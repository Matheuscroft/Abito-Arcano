import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Checkbox } from '../ui/checkbox';

const InputCheckboxLista = ({ item, onToggle }) => {
  return (
    <Flex alignItems="flex-start" mb={2} textDecoration={item.finalizada ? 'line-through' : 'none'}>
      <Checkbox
        isChecked={item.finalizada}
        onChange={onToggle}
        colorScheme="pink"
        mr={2}
      />
      <Text>{item.nome}</Text>
    </Flex>
  );
};

export default InputCheckboxLista;
