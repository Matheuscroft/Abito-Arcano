import React from "react";
import "../../listas.css";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { ItemType } from "../../../../types/item";

interface SelectTipoItemProps {
  type?: ItemType;
  setType: React.Dispatch<React.SetStateAction<ItemType>>;
}


function SelectTipoItem({ type, setType }: SelectTipoItemProps) {

   return (
    <NativeSelectRoot size="sm" width="100px">
      <NativeSelectField
        placeholder="Selecione um tipo"
        onChange={(e) => setType(e.currentTarget.value as ItemType)}
        value={type}
        width="100px"
      >
         <option value={ItemType.TASK}>Tarefa</option>
        <option value={ItemType.CHECKLIST}>Checklist</option>
        <option value={ItemType.TEXT}>Texto</option>
        <option value={ItemType.LIST}>Lista</option>
        <option value={ItemType.ACTIVITY}>Atividade</option>
      </NativeSelectField>
    </NativeSelectRoot>
  );
}

export default SelectTipoItem;
