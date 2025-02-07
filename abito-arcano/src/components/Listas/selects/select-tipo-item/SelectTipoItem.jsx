import React, { useState } from "react";
import "../../listas.css";
import { Field, NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";

function SelectTipoItem({ tipo, setTipo }) {
  console.log("tipo q chegou");
  console.log(tipo);

  return (
    <NativeSelectRoot size="sm" width="100px">
      <NativeSelectField
        placeholder="Selecione um tipo"
        onChange={(e) => setTipo(e.currentTarget.value)}
        value={tipo}
        width="100px"
      >
        <option value="tarefa">Tarefa</option>
        <option value="checklist">Checklist</option>
        <option value="texto">Texto</option>
        <option value="lista">Lista</option>
      </NativeSelectField>
    </NativeSelectRoot>
  );
}

export default SelectTipoItem;
