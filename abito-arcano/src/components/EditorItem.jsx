import React, { useState, useEffect } from "react";
import SelectTipoLista from "./Listas/SelectTipoLista";
import SelectAreaLista from "./Listas/SelectAreaLista";
import SelectTipoItem from "./Listas/selects/select-tipo-item/SelectTipoItem";
import { Box, Heading, Input } from "@chakra-ui/react";
import { NumberInputField, NumberInputRoot, NumberInputLabel } from "./ui/number-input";
import { Field } from "./ui/field";

function EditorItem({ item, onSave, tipo, setItemEditando, areas }) {
  const [nome, setNome] = useState(item.nome);
  const [numero, setNumero] = useState(item.numero);
  const [area, setArea] = useState(item.area);
  const [subarea, setSubarea] = useState(item.subarea);
  //const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [diasSemana, setDiasSemana] = useState(item.diasSemana || []);
  const [tipoNovo, setTipoNovo] = useState(item.tipo);

  const diasOpcoes = [1, 2, 3, 4, 5, 6, 7];

  const diasNomes = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  useEffect(() => {
    if (area) {
      const areaEncontrada = areas.find((a) => a.nome === area);
      setSubareas(areaEncontrada ? areaEncontrada.subareas : []);
    }
  }, [area, areas]);

  useEffect(() => {
    console.log("item");
    console.log(item);
    console.log("item.diasSemana");
    console.log(item.diasSemana);

    if (typeof item.diasSemana[0] === "string") {
      console.log("entrei aoer");
      setDiasSemana((prevDias) => {
        return prevDias.filter((d) => typeof d !== "string");
      });
    }
  }, []);

  const handleSave = () => {
    const areaNome = area === "" ? "SEM CATEGORIA" : area;
    const areaEncontrada = areas.find((a) => a.nome === areaNome);

    const subareaEncontrada = areaEncontrada?.subareas.find(
      (s) => s.nome === subarea
    );

    const nomeSubarea = subareaEncontrada ? subareaEncontrada.nome : "";

    const areaId = areaEncontrada ? areaEncontrada.id : null;
    const subareaId = subareaEncontrada ? subareaEncontrada.id : null;

    setItemEditando(false);
    if (tipo === "tarefa") {
      onSave(
        nome,
        numero,
        areaNome,
        nomeSubarea,
        areaId,
        subareaId,
        diasSemana,
        tipoNovo
      );
    } else {
      onSave(nome, numero, areaNome, nomeSubarea, areaId, subareaId);
    }
  };

  const handleDiaSemanaChange = (dia) => {
    setDiasSemana((prevDias) => {
      const filteredDias = prevDias.filter((d) => d !== 0);

      console.log("filteredDias");
      console.log(filteredDias);

      const updatedDias = filteredDias.includes(dia)
        ? filteredDias.filter((d) => d !== dia)
        : [...filteredDias, dia];

      return updatedDias.sort((a, b) => a - b);
    });
  };

  return (
    <Box border="solid 2px green">
      <Heading>Editar {tipo === "tarefa" ? "Tarefa" : "Atividade"}</Heading>
      <Input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder={`Digite o nome da ${tipo}`}
        width="200px"
        size="xs"
      />
      <Field label="Pontos" invalid >
      <NumberInputRoot
        value={numero}
        defaultValue="1"
        width="60px"
        min={0}
        onValueChange={(e) => setNumero(Number(e.value))}
        size="xs"
      >
        <NumberInputField />
      </NumberInputRoot>
      </Field>
      <select value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="">Selecione uma área</option>
        {areas.map((a, index) => (
          <option key={index} value={a.nome} style={{ backgroundColor: a.cor }}>
            {a.nome}
          </option>
        ))}
      </select>
      <select value={subarea} onChange={(e) => setSubarea(e.target.value)}>
        <option value="">Selecione uma subárea</option>
        {subareas.map((s, index) => (
          <option key={index} value={s.nome}>
            {s.nome}
          </option>
        ))}
      </select>

      <SelectTipoItem tipo={tipoNovo} setTipo={setTipoNovo} />

      {tipo === "tarefa" && (
        <div>
          <h4>Selecione os dias da semana:</h4>
          {diasOpcoes.map((dia) => (
            <label key={dia}>
              <input
                type="checkbox"
                checked={diasSemana.includes(dia)}
                onChange={() => handleDiaSemanaChange(dia)}
              />
              {diasNomes[dia - 1]}
            </label>
          ))}
        </div>
      )}

      <button onClick={() => setItemEditando(false)}>Cancelar</button>
      <button onClick={handleSave}>Salvar</button>
    </Box>
  );
}

export default EditorItem;
