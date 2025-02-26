import React from "react";
import "./ItemLista.css";

import { Flex, Text } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";

const CheckboxItemLista = ({
  item,
  lista,
  onToggle,
}) => {

  return (
    <Flex as="label" alignItems="center" width="100%">
      <Checkbox
        isChecked={item.finalizada}
        onChange={() => onToggle(lista, item.id)}
      />
      <Text
        as="span"
        textDecoration={item.finalizada ? "line-through" : "none"}
        ml={2}
        flex="1"
      >
        {item.nome}
      </Text>
    </Flex>
  );
};

export default CheckboxItemLista;
