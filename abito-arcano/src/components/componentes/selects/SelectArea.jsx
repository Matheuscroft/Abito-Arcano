"use client"

import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../ui/select"
import { useState } from "react"

const SelectArea = ({ areas, area, setArea }) => {

    console.log("area q chegou");
  console.log(area);

  //const selectedArea = Array.isArray(area) ? area[0] : area;

  const areaCollection = createListCollection({
    items: areas.map((a) => ({ label: a.nome, value: a.nome, cor: a.cor })),
  })

  console.log("areaCollection q chegou");
  console.log(areaCollection);

  return (
    <SelectRoot
      collection={areaCollection}
      width="180px"
      value={area}
      onValueChange={(e) => setArea(e.value)} 
      size="xs"
    >
      <SelectLabel>Selecione uma área</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={area || "Selecione uma área"} />
      </SelectTrigger>
      <SelectContent>
        {areaCollection.items.map((a) => (
          <SelectItem key={a.value} item={a} style={{ backgroundColor: a.cor }}>
            {a.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

export default SelectArea
