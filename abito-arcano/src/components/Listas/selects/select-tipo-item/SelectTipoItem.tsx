import React from "react";
import "../../listas.css";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";

type TipoItem = "task" | "checklist" | "text" | "list" | "activity";

interface SelectTipoItemProps {
  tipo?: TipoItem;
  setTipo: React.Dispatch<React.SetStateAction<TipoItem>>;
}


function SelectTipoItem({ tipo, setTipo }: SelectTipoItemProps) {

   return (
    <NativeSelectRoot size="sm" width="100px">
      <NativeSelectField
        placeholder="Selecione um tipo"
        onChange={(e) => setTipo(e.currentTarget.value as TipoItem)}
        value={tipo}
        width="100px"
      >
        <option value="task">Tarefa</option>
        <option value="checklist">Checklist</option>
        <option value="text">Texto</option>
        <option value="list">Lista</option>
        <option value="activity">Atividade</option>
      </NativeSelectField>
    </NativeSelectRoot>
  );
}

export default SelectTipoItem;
