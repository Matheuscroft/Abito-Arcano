"use client";

import { Box, createListCollection, Flex } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

const SelectArea = ({ areas, areaId, setAreaId }) => {

  const areaCollection = createListCollection({
    items: areas.map((a) => ({
      label: a.name.toUpperCase(),
      value: a.id,
      color: a.color,
    })),
  });

  return (
    <SelectRoot
      collection={areaCollection}
      width="180px"
      value={[areaId]}
      onValueChange={(e) => {
        const value = Array.isArray(e.value) ? e.value[0] : e.value;
        setAreaId(value);
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
            backgroundColor={
              areaCollection.items.find((a) => a.value === areaId)?.color ||
              "transparent"
            }
          />
          <SelectValueText
            whiteSpace="normal"
            textOverflow="unset"
            overflow="visible"
            placeholder={
              areaCollection.items
                .find((a) => a.value === areaId)
                ?.label.toUpperCase() || "Selecione uma área"
            }
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
                  backgroundColor: a.color,
                  display: "inline-block",
                }}
              />
              {a.label.toUpperCase()}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default SelectArea;
