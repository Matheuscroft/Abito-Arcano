"use client"

import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@chakra-ui/react"

const SelectAreaLista = ({ area, setArea, areas = [] }) => {

  
  if (!areas.length) return null;

  console.log("arearecebide")
  console.log(area)

  const areaCollection = createListCollection({
    items: areas.map((a) => ({ label: a.nome, value: a.nome, cor: a.cor })),
  })

  return (
    <SelectRoot
      collection={areaCollection}
      width="180px"
      value={area}
      onValueChange={(e) => setArea([e.value])}
      size="xs"
    >
      <SelectTrigger>
        <SelectValueText placeholder={area[0] || "Selecione uma área"} />
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

export default SelectAreaLista
