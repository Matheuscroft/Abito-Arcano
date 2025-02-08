import React, { useState, useEffect } from "react";
import Atividade from "./Atividade";
import EditorItem from "./EditorItem";
import {
  addItem,
  updateItem,
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
import EditorItemLista from "./Listas/EditorItemLista";

function ListaAtividades({
  user,
  atividades = [],
  setAtividades,
  setPontuacoes,
  dias,
  setDias,
  areas,
  resetarListaAtividades,
  dataAtual,
}) {
  const [nomeNovaAtividade, setNomeNovaAtividade] = useState("");
  const [itemEditando, setItemEditando] = useState(null);

  const reformarAtividades = async (userId, areas) => {
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

  if (!Array.isArray(atividades.atividades)) {
    atividades.atividades = [];
  }

  const handleAdicionarItem = async () => {
    if (nomeNovaAtividade.trim() === "") return;

    addItem(
      nomeNovaAtividade,
      "atividade",
      setAtividades,
      atividades.atividades,
      user.uid,
      areas
    );

    setNomeNovaAtividade("");
  };

  return (
    <div>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Atividades
      </Text>

      <HStack spacing={4} align="center" mb={4}>
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

      <HStack spacing={4} align="center" mb={4}>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => reformarAtividades(user.uid, areas)}
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
        {atividades
          .filter((atividade) => !atividade.finalizada)
          .map((atividade, index) => (
            <li key={atividade.id}>
              <ItemLista
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
                    user.uid,
                    setDias,
                    dias
                  )
                }
                onToggle={() =>
                  toggleFinalizada(
                    atividade.id,
                    "atividade",
                    atividades,
                    setAtividades,
                    setPontuacoes,
                    user.uid,
                    dataAtual
                  )
                }
                areas={areas}
                isTarefas={true}
                atividade={atividade}
                setItems={null}
                dias={dias}
                setDias={setDias}
                setPontuacoes={setPontuacoes}
              />

              {itemEditando && itemEditando === atividade && (
                <EditorItem
                  item={itemEditando}
                  tipo={"atividade"}
                  setItemEditando={setItemEditando}
                  onSave={(
                    nome,
                    numero,
                    area,
                    subarea,
                    areaId,
                    subareaId,
                    tipo
                  ) =>
                    updateItem(
                      itemEditando.id,
                      nome,
                      numero,
                      area,
                      subarea,
                      areaId,
                      subareaId,
                      tipo,
                      setAtividades,
                      atividades,
                      user.uid,
                      setDias,
                      dias,
                      null,
                      null
                    )
                  }
                  areas={areas}
                />
              )}
            </li>
          ))}
      </ul>

      <h2>Finalizadas</h2>
      <ul>
        {atividades
          .filter((atividade) => atividade.finalizada)
          .map((atividade, index) => (
            <li key={atividade.id} style={{ textDecoration: "line-through" }}>
              <ItemLista
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
                    user.uid,
                    setDias,
                    dias
                  )
                }
                onToggle={() =>
                  toggleFinalizada(
                    atividade.id,
                    "atividade",
                    atividades,
                    setAtividades,
                    setPontuacoes,
                    user.uid,
                    dataAtual
                  )
                }
                areas={areas}
                isTarefas={true}
                atividade={atividade}
                setItems={null}
                dias={dias}
                setDias={setDias}
                setPontuacoes={setPontuacoes}
              />

              {itemEditando && itemEditando === atividade && (
                <EditorItem
                  item={itemEditando}
                  tipo={"atividade"}
                  setItemEditando={setItemEditando}
                  onSave={(
                    nome,
                    numero,
                    area,
                    subarea,
                    areaId,
                    subareaId,
                    tipo
                  ) =>
                    updateItem(
                      itemEditando.id,
                      nome,
                      numero,
                      area,
                      subarea,
                      areaId,
                      subareaId,
                      tipo,
                      setAtividades,
                      atividades,
                      user.uid,
                      setDias,
                      dias,
                      null,
                      null
                    )
                  }
                  areas={areas}
                />
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ListaAtividades;
