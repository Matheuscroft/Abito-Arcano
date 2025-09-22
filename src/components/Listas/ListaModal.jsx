import React, { useState, useEffect } from "react";
import EditorItemLista from "./EditorItemLista";
import ItemLista from "./ItemLista";
import CabecalhoListaModal from "./CabecalhoListaModal";
import { Button, Card, CloseButton, Flex } from "@chakra-ui/react";
import FormAdicionarItem from "./FormAdicionarItem";

const ListaModal = ({
  listas,
  user,
  lista,
  onClose,
  setListasLocal,
  updateListas,
  areas,
  handleToggleItem,
  handleResetar,
}) => {
  const [itemEditando, setItemEditando] = useState();

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - novas listas do listamodal:");
    console.log(listas);
  }, [listas]);

  const findAndUpdateItemRecursivamente = (itens, itemId, callback) => {
    console.log("itemId", itemId);
    return itens.map((item) => {
      if (item.id === itemId) {
        console.log("Item encontrado e atualizado:", item);
        return callback(item); // Aplica o callback para atualizar o item
      } else if (item.itens && item.itens.length > 0) {
        console.log("ELSEIF", item);
        return {
          ...item,
          itens: findAndUpdateItemRecursivamente(item.itens, itemId, callback),
        };
      }
      console.log("RETURN ITEM", item);
      return item;
    });
  };

  const handleDeleteItem = async (itemId) => {
    const deleteItemFromItems = (itens) => {
      return itens
        .filter((item) => item.id !== itemId)
        .map((item) => {
          if (item.itens && Array.isArray(item.itens)) {
            return {
              ...item,
              itens: deleteItemFromItems(item.itens),
            };
          }
          return item;
        });
    };

    const novaLista = {
      ...lista,
      itens: deleteItemFromItems(lista.itens),
    };

    updateListas(user.uid, lista, listas, setListasLocal, novaLista);
  };

  const moveItem = (itemId, direction) => {
    console.log("demorouuu");
    console.log("itemId");
    console.log(itemId);
    console.log("direction");
    console.log(direction);

    const listaAtualizada = {
      ...lista,
      itens: findAndMoveItemRecursivamente(lista.itens, itemId, direction),
    };

    updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);
  };

  const findAndMoveItemRecursivamente = (itens, itemId, direction) => {
    const index = itens.findIndex((item) => item.id === itemId);

    if (index !== -1) {
      const targetIndex = index + direction;

      if (targetIndex >= 0 && targetIndex < itens.length) {
        const novosItens = [...itens];
        [novosItens[index], novosItens[targetIndex]] = [
          novosItens[targetIndex],
          novosItens[index],
        ];
        return novosItens;
      }
      return itens;
    }

    return itens.map((item) =>
      item.itens && item.itens.length > 0
        ? {
            ...item,
            itens: findAndMoveItemRecursivamente(item.itens, itemId, direction),
          }
        : item
    );
  };

  const handleSave = (item, nome, tipo) => {
    const itemAtualizado = {
      ...item,
      nome: nome,
      tipo: tipo,
    };
    console.log("itemAtualizado do modal");
    console.log(itemAtualizado);

    const listaAtualizada = {
      ...lista,
      itens: findAndUpdateItemRecursivamente(lista.itens, item.id, (item) => ({
        ...item,
        nome: nome,
        tipo: tipo,
      })),
    };

    console.log("listaAtualizada");
    console.log(listaAtualizada);
    updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);
  };

  const handleSaveLista = (novaLista) => {
    updateListas(user.uid, lista, listas, setListasLocal, novaLista);
  };

  return (
    <Card.Root
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      background="black"
      padding="20px"
      border="1px solid #ccc"
      maxHeight="calc(100vh - 210px)"
      overflowY="auto"
      width="800px"
    >
      <Card.Header py="20px" position="relative">
        <CabecalhoListaModal lista={lista} onSave={handleSaveLista} areas={areas} />
        <CloseButton position="absolute" top="10px" right="10px" onClick={onClose} />
      </Card.Header>
      <Card.Body>
        <Flex wrap="nowrap" mb={23}>
          <FormAdicionarItem
            listas={listas}
            user={user}
            lista={lista}
            setListasLocal={setListasLocal}
            updateListas={updateListas}
            areas={areas}
          />
          <Button
            size="xs"
            variant="outline"
            colorPalette="red"
            onClick={() => handleResetar(lista)}
          >
            Resetar checklists
          </Button>
        </Flex>
        <ul>
          {lista.itens &&
            lista.itens.map((item, index) => (
              <li key={item.id}>
                <ItemLista
                  listas={listas}
                  user={user}
                  item={item}
                  index={index}
                  lista={lista}
                  onEdit={() => setItemEditando(item)}
                  onDelete={handleDeleteItem}
                  onToggle={handleToggleItem}
                  onMove={moveItem}
                  setListasLocal={setListasLocal}
                  updateListas={updateListas}
                  onSave={handleSave}
                />

                {itemEditando && itemEditando === item && (
                  <EditorItemLista
                    item={itemEditando}
                    setItemEditando={setItemEditando}
                    onSave={(nome, tipo) =>
                      handleSave(itemEditando, nome, tipo)
                    }
                  />
                )}
              </li>
            ))}
        </ul>
      </Card.Body>

      <button onClick={onClose}>Fechar</button>
    </Card.Root>
  );
};

export default ListaModal;
