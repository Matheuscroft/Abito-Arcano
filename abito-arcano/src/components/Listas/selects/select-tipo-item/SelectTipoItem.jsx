import React from "react";
import "../../listas.css";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";

function SelectTipoItem({ tipo, setTipo }) {
  if(tipo === undefined){
    tipo = 'atividade'
  }

  return (
    <NativeSelectRoot size="sm" width="100px">
      <NativeSelectField
        placeholder="Selecione um tipo"
        onChange={(e) => setTipo(e.currentTarget.value)}
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
