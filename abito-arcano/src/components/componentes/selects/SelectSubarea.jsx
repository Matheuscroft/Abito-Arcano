"use client";

import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../ui/select";

const SelectSubarea = ({ subareas, subarea, setSubarea }) => {

    console.log("subarea q chegou");
  console.log(subarea);
  const subareaCollection = createListCollection({
    items: subareas.map((s) => ({ label: s.nome, value: s.nome })),
  });

  return (
    <SelectRoot
      collection={subareaCollection}
      width="180px"
      value={subarea}
      onValueChange={(e) => setSubarea(e.value)}
      size="xs"
    >
      <SelectLabel>Selecione uma subárea</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={subarea || "Selecione uma subárea"} />
      </SelectTrigger>
      <SelectContent>
        {subareaCollection.items.map((s) => (
          <SelectItem key={s.value} item={s}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default SelectSubarea;
