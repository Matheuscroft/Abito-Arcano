"use client";

import { Box, Flex, createListCollection, type ListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import type { AreaResponseDTO } from "@/types/area";

interface SelectAreaProps {
  areas: AreaResponseDTO[];
  areaId: string;
  setAreaId: React.Dispatch<React.SetStateAction<string>>;
}

const SelectArea: React.FC<SelectAreaProps> = ({ areas, areaId, setAreaId }) => {
  // Coleção apenas com label e value
  const areaCollection: ListCollection<{ label: string; value: string }> =
    createListCollection({
      items: areas.map((a) => ({
        label: a.name.toUpperCase(),
        value: a.id,
      })),
    });

  // Lookup para cores
  const areaColors = Object.fromEntries(areas.map(a => [a.id, a.color]));

  return (
    <SelectRoot
      collection={areaCollection}
      width="180px"
      value={[areaId]}
      onValueChange={(e) => {
        const value = Array.isArray(e.value) ? e.value[0] : e.value;
        if (value) setAreaId(value);
      }}
      size="xs"
    >
      <SelectLabel>Selecione uma área</SelectLabel>

      <SelectTrigger>
        <Flex align="center" gap="2" px="2" flex="1" minW="0">
          <Box
            width="10px"
            height="10px"
            borderRadius="50%"
            backgroundColor={areaColors[areaId] || "transparent"}
          />
          <SelectValueText
            whiteSpace="normal"
            textOverflow="unset"
            overflow="visible"
            placeholder={areaCollection.items.find((a) => a.value === areaId)?.label || "Selecione uma área"}
          />
        </Flex>
      </SelectTrigger>

      <SelectContent>
        {areaCollection.items.map((a) => (
          <SelectItem key={a.value} item={a}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: areaColors[a.value],
                  display: "inline-block",
                }}
              />
              {a.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default SelectArea;
