import React from "react";
import "./ItemLista.css";
import { Flex, Text } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { ItemType, type ChecklistItem } from "../../types/item";

interface CheckboxItemListaProps {
  item: ChecklistItem;
  lista: string;
  onToggle?: (lista: string, itemId: string) => void;
}

const CheckboxItemLista: React.FC<CheckboxItemListaProps> = ({
  item,
  lista,
  onToggle,
}) => {


  const finalizada = item.type === ItemType.CHECKLIST && (item as any).finalizada; 

  return (
    <Flex as="label" alignItems="center" width="100%">
      <Checkbox
        inputProps={{
          checked: !!finalizada,
          onChange: () => onToggle?.(lista, item.id),
        }}
      />
      <Text
        as="span"
        textDecoration={finalizada ? "line-through" : "none"}
        ml={2}
        flex="1"
      >
        {item.title}
      </Text>
    </Flex>
  );
};

export default CheckboxItemLista;
