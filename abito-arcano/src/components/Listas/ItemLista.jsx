import React, { useEffect } from "react";
import FormItemLista from "../componentes/forms/FormItemLista/FormItemLista";
import "./ItemLista.css";
import ListaAninhada from "./ListaAninhada";
import ParagrafoItemLista from "./ParagrafoItemLista";
import Tarefa from "../pages/ToDoList/Tarefa";
import { Box, Flex } from "@chakra-ui/react";
import CheckboxItemLista from "./CheckboxItemLista";
import Atividade from "../Atividade";

const ItemLista = ({
  listas,
  user,
  item,
  onEdit,
  lista,
  onDelete,
  onToggle,
  onSave,
  onMove,
  index,
  setListasLocal,
  updateListas,
  path = [],
  areas,
  isTarefas = null,
  tarefa = null,
  setItems = null,
  dias = null,
  setDias = null,
  diaVisualizado = null,
  setPontuacoes,
  isAninhado = false,
}) => {
  const newPath = [...path, index];

  useEffect(() => {
    }, [item]);

  return (
    <Flex
      justify="space-between"
      align="center"
      width="100%"
      boxSizing="border-box"
    >
      {item && index !== undefined && (
        <>
          <Flex flex="1" minWidth="50%">
            {item.type === "checklist" && (
              <CheckboxItemLista
                item={item}
                lista={lista}
                onToggle={onToggle}
              />
            )}
            {item.type === "text" && <ParagrafoItemLista item={item} />}
            {item.type === "list" && (
              <ListaAninhada
                listas={listas}
                user={user}
                index={index}
                item={item}
                lista={lista}
                onToggle={onToggle}
                setListasLocal={setListasLocal}
                updateListas={updateListas}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                path={newPath}
                onSave={onSave}
                areas={areas}
                isTarefas={isTarefas}
                tarefa={tarefa}
                setItems={setItems}
                dias={dias}
                setDias={setDias}
                diaVisualizado={diaVisualizado}
                setPontuacoes={setPontuacoes}
              />
            )}
            {item.type === "task" && (
              <Tarefa
                tarefa={item}
                areas={areas}
                index={index}
                lista={lista}
                onToggle={onToggle}
                isAninhado={isAninhado}
              />
            )}
            {item.type === "activity" && (
              <Atividade
                atividade={item}
                areas={areas}
                index={index}
                lista={lista}
                onToggle={onToggle}
              />
            )}
          </Flex>

          <Box display="flex" justifyContent="flex-end">
            <FormItemLista
              item={item}
              onEdit={onEdit}
              lista={lista}
              onDelete={onDelete}
              onMove={onMove}
              index={index}
              path={newPath}
            />
          </Box>
        </>
      )}
    </Flex>
  );
};

export default ItemLista;
