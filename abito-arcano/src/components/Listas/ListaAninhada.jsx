"use client";

import React, { useEffect, useState } from "react";
import "./ItemLista.css";
import FormAdicionarItem from "./FormAdicionarItem";
import ItemLista from "./ItemLista";
import EditorItemLista from "./EditorItemLista";
import { setarCorAreaETexto } from "../utils";
import { toggleFinalizada } from "../todoUtils";

import {
  Stack,
  Text,
  Flex,
  Badge,
  IconButton,
  Center,
  Icon,
} from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { FaClipboardList, FaPlus } from "react-icons/fa6";
import EditorItem from "../EditorItem";



const ListaAninhada = ({
  listas,
  user,
  item,
  lista,
  onToggle,
  setListasLocal,
  updateListas,
  onSave,
  onDelete,
  onMove,
  areas,
  isTarefas = null,
  tarefa = null,
  setItems = null,
  dias = null,
  setDias = null,
  diaVisualizado = null,
  setPontuacoes,
}) => {
  const [itemEditando, setItemEditando] = useState();
  const [corArea, setCorArea] = useState("#000");
  const [corTexto, setCorTexto] = useState("#fff");

  const [isOpen, setIsOpen] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  useEffect(() => {
    if (Array.isArray(areas) && item.areaId) {
      setarCorAreaETexto(item, areas, setCorArea, setCorTexto);
    } else {
      console.log("areas não é um array ou item não possui areaId");
    }
  }, [item.areaId, areas]);

  /* useEffect(() => {
    console.log("Estado atualizadOOOOOO - item:");
    console.log(item)
  }, [item]);*/

  useEffect(() => {
    if (item.itens && item.itens.length > 0) {
      const finalizadaItems = item.itens.filter(
        (subItem) => subItem.finalizada || subItem.finalizada
      ).length;

      setIsIndeterminate(
        finalizadaItems > 0 && finalizadaItems < item.itens.length
      );
    }
  }, [item.itens]);

  const handleToggleLista = async (lista, itemId) => {
    console.log("lista handleToggleLista");
    console.log(lista);
    console.log("itemId handleToggleLista");
    console.log(itemId);

    const listaAtualizada = {
      ...lista,
      itens: findAndToggleItem(lista.itens, itemId),
    };

    console.log("listaAtualizada");
    console.log(listaAtualizada);

    await toggleFinalizada(
      itemId,
      "lista",
      lista.itens,
      null,
      setPontuacoes,
      user.uid,
      diaVisualizado,
      dias,
      setDias,
      lista.id
    );

    //updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);
  };

  const findAndToggleItem = (itens, targetId, toggleState) => {
    return itens.map((item) => {
      if (item.id === targetId) {
        const newFinalizadaState =
          toggleState !== undefined ? toggleState : !item.finalizada;
        return {
          ...item,
          finalizada: newFinalizadaState,
          itens: item.itens
            ? findAndToggleItem(item.itens, null, newFinalizadaState)
            : item.itens,
        };
      } else if (item.itens) {
        const updatedSubItems = findAndToggleItem(
          item.itens,
          targetId,
          toggleState
        );
        const allSubItemsFinalizada = updatedSubItems.every(
          (subItem) => subItem.finalizada
        );
        return {
          ...item,
          finalizada: allSubItemsFinalizada,
          itens: updatedSubItems,
        };
      }
      return item;
    });
  };

  return (
    <Stack
      spacing={2}
      p={1}
      border="2px solid coral"
      borderRadius="md"
      width="100%"
    >
      <Flex align="center" gap={3}>
        <Checkbox
          isChecked={item.finalizada}
          onChange={() => onToggle(lista, item.id)}
        />

        <Text
          as="button"
          fontWeight="bold"
          fontSize="md"
          color="blue.200"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => console.log("Clicou no nome!")}
        >
          {item.nome}
        </Text>

        <Badge
          bg={corArea}
          color={corTexto}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          +{item.numero} {item.area}
        </Badge>

        <Badge
          bg={corArea}
          color="white"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="sm"
        >
          +1
        </Badge>
      </Flex>
      <Flex align="center" gap={2} mt={1}>
        <IconButton
          size="xs"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Adicionar Item"
        >
          <FaPlus />
        </IconButton>

        {isOpen && (
          <FormAdicionarItem
            listas={listas}
            user={user}
            lista={lista}
            setListasLocal={setListasLocal}
            updateListas={updateListas}
            listaAninhada={item}
            isTarefas={isTarefas}
            tarefa={tarefa}
            setItems={setItems}
            dias={dias}
            setDias={setDias}
            diaVisualizado={diaVisualizado}
            areas={areas}
          />
        )}
      </Flex>
      <ul>
        {Array.isArray(item.itens) && item.itens.length === 0 ? (
          <Center flexDirection="column" py={4} color="gray.500">
          <Icon as={FaClipboardList} boxSize={8} mb={2} />
          <Text fontSize="md" fontWeight="medium">
            Nenhum item adicionado
          </Text>
          <Text fontSize="sm">Clique no "+" para adicionar um item</Text>
        </Center>
        ) : (
          item.itens &&
          item.itens.map((subItem, index) => (
            <li key={subItem.id}>
              <ItemLista
                listas={listas}
                user={user}
                item={subItem}
                index={index}
                lista={lista}
                onEdit={() => setItemEditando(subItem)}
                onDelete={onDelete}
                onToggle={() => handleToggleLista(item, subItem.id)}
                onMove={onMove}
                setListasLocal={setListasLocal}
                updateListas={updateListas}
                onSave={onSave}
                isTarefas={isTarefas}
                tarefa={tarefa}
                setItems={setItems}
                dias={dias}
                setDias={setDias}
                diaVisualizado={diaVisualizado}
                setPontuacoes={setPontuacoes}
                isAninhado={true}
              />

              {itemEditando && itemEditando === subItem && (
                <div>
                <EditorItemLista
                  item={itemEditando}
                  setItemEditando={setItemEditando}
                  onSave={(nome, tipo) => onSave(itemEditando.id, nome, tipo)}
                />
                <EditorItem
                  item={itemEditando}
                  tipo={itemEditando.tipo}
                  setItemEditando={setItemEditando}
                  onSave={(
                    nome,
                    numero,
                    area,
                    subarea,
                    areaId,
                    subareaId,
                    diasSemana,
                    tipo
                  ) =>
                    onSave(
                      itemEditando.id,
                      nome,
                      numero,
                      area,
                      subarea,
                      areaId,
                      subareaId,
                      diasSemana,
                      tipo
                    )}
                  areas={areas}
                />
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </Stack>
  );
};

export default ListaAninhada;
