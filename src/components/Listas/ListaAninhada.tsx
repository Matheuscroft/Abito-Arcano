"use client";

import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
import type {
  CompletedTaskResponseDTO,
  GenericItem,
} from "@/types/task";
import type { AreaResponseDTO } from "@/types/area";
import type { DayResponseDTO } from "@/types/day";
import type { ItemResponse, ListItem } from "@/types/item";

const stackProps = {
  spacing: 2,
  p: 1,
  border: "2px solid coral",
  borderRadius: "md",
  width: "100%",
} as const;

interface ListaAninhadaProps<T = ItemResponse | CompletedTaskResponseDTO> {
  listas: GenericItem[];
  user: { uid: string };
  item: ListItem;
  lista: any;
  onToggle?: (lista: any, itemId: string) => void;
  setListasLocal?: Dispatch<SetStateAction<any[]>>; 
  updateListas?: (...args: any[]) => void;
  onSave?: (item: T) => void;
  onDelete?: () => void;
  onMove?: (item: T, direction: number) => void;
  areas: AreaResponseDTO[];
  isTarefas?: boolean;
  setItems?: Dispatch<SetStateAction<T[]>>;
  dias?: DayResponseDTO[] | null;
  setDias?: Dispatch<SetStateAction<DayResponseDTO[]>>;
  diaVisualizado?: any;
  setPontuacoes?: (...args: any[]) => void;
  path?: (number | string)[];
  index?: number;
  onEdit?: (path?: (number | string)[]) => void;
}

type LegacyItem = {
  itens?: { finalizada?: boolean }[];
  finalizada?: boolean;
};

const ListaAninhada = <T extends ItemResponse | CompletedTaskResponseDTO>(
  props: ListaAninhadaProps<T>
) => {
  const {
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
    setItems = null,
    dias = null,
    setDias = null,
    diaVisualizado = null,
    setPontuacoes,
  } = props;

  const [itemEditando, setItemEditando] = useState<T | null>(null);
  const [corArea, setCorArea] = useState("#000");
  const [corTexto, setCorTexto] = useState("#fff");

  const [isOpen, setIsOpen] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  useEffect(() => {
    if (Array.isArray(areas) && "areaId" in item && item.areaId) {
      setarCorAreaETexto(item, areas, setCorArea, setCorTexto);
    } else {
      console.log("areas não é um array ou item não possui areaId");
    }
  }, [item, areas]);

  /* useEffect(() => {
    console.log("Estado atualizadOOOOOO - item:");
    console.log(item)
  }, [item]);*/

  useEffect(() => {
    const legacyItem = item as LegacyItem;

    if (legacyItem.itens && legacyItem.itens.length > 0) {
      const finalizadaItems = legacyItem.itens.filter(
        (subItem) => subItem.finalizada
      ).length;

      setIsIndeterminate(
        finalizadaItems > 0 && finalizadaItems < legacyItem.itens.length
      );
    }
  }, [item]);

  const handleToggleLista = async (lista, itemId) => {
    console.log("lista handleToggleLista");
    console.log(lista);
    console.log("itemId handleToggleLista");
    console.log(itemId);

    const listaAtualizada = {
      ...lista,
      itens: findAndToggleItem(lista.itens, itemId, undefined),
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
    <Stack {...stackProps}>
      <Flex align="center" gap={3}>
        <Checkbox
          checked={("finalizada" in item ? item.finalizada : false) as boolean}
          onChange={() => {
            if (onToggle && item.id) {
              onToggle(lista, item.id);
            }
          }}
        />

        <Text
          as="button"
          fontWeight="bold"
          fontSize="md"
          color="blue.200"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => console.log("Clicou no nome!")}
        >
          {item.title}
        </Text>

        <Badge
          bg={corArea}
          color={corTexto}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          {item.score}{" "}
          {item.areaId}
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

        {isOpen && updateListas && setListasLocal && (
          <FormAdicionarItem
            listas={listas}
            user={user}
            lista={lista}
            setListasLocal={setListasLocal}
            updateListas={updateListas}
            listaAninhada={item}
            isTarefas={!!isTarefas}
            setItems={setItems as unknown as Dispatch<SetStateAction<any[]>>}
            dias={dias}
            setDias={setDias}
            diaVisualizado={diaVisualizado}
            areas={areas}
          />
        )}
      </Flex>
      <ul>
        {Array.isArray((item as any).itens) &&
        (item as any).itens.length === 0 ? (
          <Center flexDirection="column" py={4} color="gray.500">
            <Icon as={FaClipboardList} boxSize={8} mb={2} />
            <Text fontSize="md" fontWeight="medium">
              Nenhum item adicionado
            </Text>
            <Text fontSize="sm">Clique no "+" para adicionar um item</Text>
          </Center>
        ) : (
          Array.isArray((item as any).itens) &&
          (item as any).itens.map((subItem, index) => (
            <li key={subItem.id}>
              <ItemLista
                listas={listas}
                user={user}
                item={subItem}
                index={index}
                lista={lista}
                onEdit={() => setItemEditando(subItem)}
                onDelete={onDelete ?? (() => {})}
                onToggle={() => handleToggleLista(item, subItem.id)}
                onMove={onMove ?? (() => {})}
                setListasLocal={setListasLocal ?? (() => {})}
                updateListas={updateListas ?? (() => {})}
                onSave={onSave ?? (() => {})}
                isTarefas={isTarefas}
                setItems={setItems ?? (() => {})}
                dias={dias}
                setDias={setDias ?? (() => {})}
                diaVisualizado={diaVisualizado}
                setPontuacoes={setPontuacoes ?? (() => {})}
                isAninhado={true}
                areas={areas}
              />

              {itemEditando && itemEditando === subItem && (
                <div>
                  <EditorItemLista
                    item={itemEditando}
                    setItemEditando={setItemEditando as React.Dispatch<React.SetStateAction<ItemResponse | CompletedTaskResponseDTO | null>>}
                    onSave={(updatedItem) => {
                      if (!onSave || !itemEditando) return;

                      onSave(updatedItem as T);
                    }}
                  />
                  <EditorItem
                    item={{
                      ...(itemEditando as any),
                      id: String(itemEditando.id),
                    }}
                    setItemEditando={setItemEditando as React.Dispatch<React.SetStateAction<ItemResponse | CompletedTaskResponseDTO | null>>}
                     onSave={(updatedItem) => {
                      if (!onSave) return;

                      onSave(updatedItem as T);
                    }}
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
