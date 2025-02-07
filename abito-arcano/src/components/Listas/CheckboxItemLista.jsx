import React from "react";
import FormItemLista from "../componentes/forms/FormItemLista/FormItemLista";
import "./ItemLista.css";
import ListaAninhada from "./ListaAninhada";
import ParagrafoItemLista from "./ParagrafoItemLista";
import Tarefa from "../pages/ToDoList/Tarefa";

import { Checkbox } from "../ui/checkbox";
import { Text } from "@chakra-ui/react";

const CheckboxItemLista = ({
  item,
  lista,
  onToggle,
}) => {

  return (
    <div>
      {item.tipo === "checklist" && (
        <label>
          <Checkbox
            checked={item.completed}
            onCheckedChange={() => onToggle(lista, item.id)}
            ms="6"
          ></Checkbox>
          <Text
            as="span"
            textDecoration={item.completed ? "line-through" : "none"}
            ml={2}
          >
            {item.nome}
          </Text>
        </label>
      )}
    </div>
  );
};

export default CheckboxItemLista;
