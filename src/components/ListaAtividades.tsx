import React, { useState, type SetStateAction, type Dispatch } from "react";
import EditorItem from "./EditorItem";
import {
  addItem,
  toggleFinalizada,
  deleteItem,
  buscarIdsAreaESubarea,
} from "./todoUtils";
import {
  getListaAtividades,
  setListaAtividades,
} from "../auth/firebaseAtividades.js";
import { Button, HStack, Input, Text } from "@chakra-ui/react";
import ItemLista from "./Listas/ItemLista";
import type { DayResponseDTO } from "@/types/day";
import type { AreaResponseDTO } from "@/types/area";
import type { ActivityItem, ItemResponse } from "@/types/item";
import type { CompletedTaskResponseDTO } from "@/types/task";
import type { UserResponseDTO } from "@/types/user";

const hStackInputProps = {
  spacing: 4,
  align: "center",
  mb: 4,
} as const;

const hStackButtonsProps = {
  spacing: 4,
  align: "center",
  mb: 4,
} as const;

interface ListaAtividadesProps {
  user: UserResponseDTO;
  atividades: ActivityItem[];
  setAtividades: Dispatch<SetStateAction<ActivityItem[]>>;
  setPontuacoes: (...args: any[]) => void;
  dias?: DayResponseDTO[];
  setDias?: Dispatch<SetStateAction<DayResponseDTO[]>>;
  areas: AreaResponseDTO[];
  resetarListaAtividades: () => void;
  dataAtual: string;
}

const ListaAtividades: React.FC<ListaAtividadesProps> = ({
  user,
  atividades = [],
  setAtividades,
  setPontuacoes,
  dias,
  setDias,
  areas,
  resetarListaAtividades,
  dataAtual,
}) => {
  const [nomeNovaAtividade, setNomeNovaAtividade] = useState<string>("");
  const [itemEditando, setItemEditando] = useState<ItemResponse | null>(null);

  const reformarAtividades = async (
    userId: string,
    areas: AreaResponseDTO[]
  ) => {
    try {
      const atividades = await getListaAtividades(userId);

      const atividadesReformadas = atividades.map((atividade) => {
        const { areaId, subareaId } = buscarIdsAreaESubarea(
          areas,
          atividade.area,
          atividade.subarea
        );

        return {
          id: atividade.id,
          area: atividade.area,
          areaId: areaId,
          finalizada: atividade.finalizada,
          nome: atividade.nome,
          numero: atividade.numero,
          subarea: atividade.subarea,
          subareaId: subareaId,
          userId: atividade.userId,
        };
      });

      console.log("atividadesReformadas");
      console.log(atividadesReformadas);

      await setListaAtividades(userId, atividadesReformadas);
      console.log("Atividades reformadas e salvas com sucesso.");
    } catch (error) {
      console.error("Erro ao reformar as atividades:", error);
    }
  };

  /*useEffect(() => {
    console.log("Estado no ListaAtividades - atividades:");
    console.log(atividades)

    console.log("atividades.atividades:");
    console.log(atividades.atividades)
  }, [atividades]);*/

  if (!Array.isArray(atividades)) {
    atividades = [];
  }

  const handleAdicionarItem = async () => {
    if (nomeNovaAtividade.trim() === "") return;

    addItem(
      nomeNovaAtividade,
      "atividade",
      setAtividades,
      atividades,
      user.id,
      areas
    );

    setNomeNovaAtividade("");
  };

  const handleUpdateItem = (updatedItem: ItemResponse) => {
    //updateItem();
  };

  return (
    <div>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Atividades
      </Text>

      <HStack {...hStackInputProps}>
        <Input
          type="text"
          value={nomeNovaAtividade}
          onChange={(e) => setNomeNovaAtividade(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdicionarItem();
            }
          }}
          placeholder="Digite o nome da atividade"
          width="200px"
        />
        <Button size="xs" onClick={handleAdicionarItem}>
          Adicionar Atividade
        </Button>
      </HStack>

      <HStack {...hStackButtonsProps}>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => reformarAtividades(user.id, areas)}
        >
          Reformar Lista de Atividades
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => resetarListaAtividades()}
        >
          Resetar Lista de Atividades
        </Button>
      </HStack>

      <ul>
        {atividades.map((atividade, index) => (
          <li key={atividade.id}>
            <ItemLista
              listas={[]}
              onMove={() => {}}
              user={user}
              item={atividade}
              index={index}
              lista={atividades}
              onEdit={() => setItemEditando(atividade)}
              onDelete={() =>
                deleteItem(
                  atividade,
                  "atividade",
                  setAtividades,
                  atividades,
                  user.id,
                  setDias,
                  dias ?? null
                )
              }
              onToggle={() =>
                toggleFinalizada(
                  atividade.id,
                  "atividade",
                  atividades,
                  setAtividades,
                  setPontuacoes,
                  user.id,
                  dataAtual
                )
              }
              areas={areas}
              isTarefas={true}
              setItems={() => {}}
              dias={dias ?? null}
              setDias={setDias ?? (() => {})}
              setPontuacoes={setPontuacoes}
            />

            {itemEditando && itemEditando === atividade && (
              <EditorItem
                item={itemEditando}
                setItemEditando={setItemEditando as React.Dispatch<React.SetStateAction<ItemResponse | CompletedTaskResponseDTO | null>>}
                onSave={(updatedItem) => handleUpdateItem(updatedItem as ItemResponse)}
                areas={areas}
              />
            )}
          </li>
        ))}
      </ul>

      <h2>Finalizadas</h2>
      <ul>
        {atividades.map((atividade, index) => (
          <li key={atividade.id} style={{ textDecoration: "line-through" }}>
            <ItemLista
              listas={[]}
              user={user}
              item={atividade}
              index={index}
              lista={atividades}
              onMove={() => {}}
              onEdit={() => setItemEditando(atividade)}
              onDelete={() =>
                deleteItem(
                  atividade,
                  "atividade",
                  setAtividades,
                  atividades,
                  user.id,
                  setDias,
                  dias ?? null
                )
              }
              onToggle={() =>
                toggleFinalizada(
                  atividade.id,
                  "atividade",
                  atividades,
                  setAtividades,
                  setPontuacoes,
                  user.id,
                  dataAtual
                )
              }
              areas={areas}
              isTarefas={true}
              setItems={() => {}}
              dias={dias ?? null}
              setDias={setDias ?? (() => {})}
              setPontuacoes={setPontuacoes}
            />

            {itemEditando && itemEditando === atividade && (
              <EditorItem
                item={itemEditando}
                setItemEditando={setItemEditando as React.Dispatch<React.SetStateAction<ItemResponse | CompletedTaskResponseDTO | null>>}
                onSave={(updatedItem) => handleUpdateItem(updatedItem as ItemResponse)}
                areas={areas}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaAtividades;
