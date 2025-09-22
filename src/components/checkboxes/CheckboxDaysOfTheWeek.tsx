import React from "react";
import { Checkbox } from "../ui/checkbox";
import { CheckboxGroup, Fieldset, Flex } from "@chakra-ui/react";

interface CheckboxDaysOfTheWeekProps {
  diasSelecionados: number[];
  setDiasSelecionados: React.Dispatch<React.SetStateAction<number[]>>;
}

function CheckboxDaysOfTheWeek({
  diasSelecionados,
  setDiasSelecionados,
}: CheckboxDaysOfTheWeekProps) {
  const diasOpcoes: number[] = [1, 2, 3, 4, 5, 6, 7];
  const diasNomes: string[] = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const handleChange = (dia: number) => {
    setDiasSelecionados((prev) => {
      const filtered = prev.filter((d) => d !== 0);
      const updated = filtered.includes(dia)
        ? filtered.filter((d) => d !== dia)
        : [...filtered, dia];
      return updated.sort((a, b) => a - b);
    });
  };

  return (
    <Fieldset.Root>
      <CheckboxGroup name="dias-semana" value={diasSelecionados.map(String)}>
        <Fieldset.Legend fontSize="sm" mb="2" mt="6">
          Selecione os dias da semana:
        </Fieldset.Legend>
        <Fieldset.Content>
          <Flex wrap="wrap" gap={2}>
            {diasOpcoes.map((dia) => (
              <Checkbox
                key={dia}
                value={String(dia)}
                checked={diasSelecionados.includes(dia)}
                onChange={() => handleChange(dia)}
                size="sm"
              >
                {diasNomes[dia - 1]}
              </Checkbox>
            ))}
          </Flex>
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  );
}

export default CheckboxDaysOfTheWeek;