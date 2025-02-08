import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import React from "react";

const SelectTipoLista = ({ tipo, setTipo, onSave }) => {
  const handleChange = (e) => {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    if (onSave) {
      onSave(novoTipo);
    }
  };

  return (
    <NativeSelectRoot size="sm" width="100px">
      <NativeSelectField
        placeholder="Selecione um tipo"
        onChange={handleChange}
        value={tipo}
        width="100px"
      >
        <option value="lista">Lista</option>
        <option value="treino">Treino</option>
        <option value="checklist">Checklist</option>
      </NativeSelectField>
    </NativeSelectRoot>
  );
};

export default SelectTipoLista;
