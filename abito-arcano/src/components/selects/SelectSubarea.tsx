"use client";

import { createListCollection, type ListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import type { SubareaSimpleResponseDTO } from "@/types/area";

interface SelectSubareaProps {
  subareas: SubareaSimpleResponseDTO[];
  subareaId: string;
  setSubareaId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectSubarea: React.FC<SelectSubareaProps> = ({
  subareas,
  subareaId,
  setSubareaId,
}) => {
  const subareaCollection: ListCollection<{ label: string; value: string }> =
    createListCollection({
      items: subareas.map((s) => ({ label: s.name, value: s.id })),
    });

  return (
    <SelectRoot
      collection={subareaCollection}
      width="180px"
      value={[subareaId]}
      onValueChange={(e) => {
        const value = Array.isArray(e.value) ? e.value[0] : e.value;
        setSubareaId(value ?? "");
      }}
      size="xs"
    >
      <SelectLabel>Selecione uma subárea</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={subareaId || "Selecione uma subárea"} />
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
