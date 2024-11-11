import React, { useState, useEffect } from 'react';
import { updateLocalList } from './listaUtils';
import { v4 as uuidv4 } from 'uuid';
import EditorItemLista from './EditorItemLista';
import ItemLista from './ItemLista';
import FormAdicionarItem from './FormAdicionarItem';
import { setListas } from '../../auth/firebaseListas.mjs';

const ListaModal = ({ listas, user, lista, onClose, setListasLocal, updateListas }) => {
  const [novoItem, setNovoItem] = useState('');
  const [tipoItem, setTipoItem] = useState('checklist');
  //const [listaLocal, setListaLocal] = useState(lista);
  const [itemEditando, setItemEditando] = useState()

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - novas listas do listamodal:");
    console.log(listas)
  }, [listas]);

  const findAndUpdateItemRecursivamente = (itens, itemId, callback) => {
    console.log("itemId", itemId);
    return itens.map((item) => {
      if (item.id === itemId) {
        console.log("Item encontrado e atualizado:", item);
        return callback(item); // Aplica o callback para atualizar o item
      } else if (item.itens && item.itens.length > 0) {
        console.log("ELSEIF", item);
        return { ...item, itens: findAndUpdateItemRecursivamente(item.itens, itemId, callback) };
      }
      console.log("RETURN ITEM", item);
      return item;
    });
  };

  const handleToggleItem = (itemId) => {

    console.log("to no handlet otggle")
    const findAndToggleItem = (itens) => {
      return itens.map(item => {
        if (item.id === itemId) {
          return { ...item, completed: !item.completed };
        }
        if (item.itens) {
          return { ...item, itens: findAndToggleItem(item.itens) };
        }
        return item;
      });
    };

    const listaAtualizada = {
      ...lista,
      itens: findAndToggleItem(lista.itens)
    };

    console.log("listaAtualizada", listaAtualizada);
    updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);
  };

  const handleDeleteItem = async (itemId) => {

    const deleteItemFromItems = (itens) => {
      return itens
        .filter(item => item.id !== itemId)
        .map(item => {
          if (item.itens && Array.isArray(item.itens)) {
            return {
              ...item,
              itens: deleteItemFromItems(item.itens)
            };
          }
          return item;
        });
    };


    const novaLista = {
      ...lista,
      itens: deleteItemFromItems(lista.itens)
    };

    updateListas(user.uid, lista, listas, setListasLocal, novaLista);

  };


  /*const moveItem = (index, direction) => {
    const novosItens = [...lista.itens];
    const targetIndex = index + direction;

    if (targetIndex >= 0 && targetIndex < novosItens.length) {
      const temp = novosItens[index];
      novosItens[index] = novosItens[targetIndex];
      novosItens[targetIndex] = temp;
      const listaAtualizada = { ...lista, itens: novosItens };
      //setListaLocal(listaAtualizada);
      console.log()
      //updateListas(user.uid, lista.id, listas, setListasLocal, null, null, null, novosItens);
    }
  };*/

  // Função para mover um item dentro de uma lista aninhada
  const moveItem = (itemId, direction) => {

    console.log("demorouuu")
    console.log("itemId")
    console.log(itemId)
    console.log("direction")
    console.log(direction)

    const listaAtualizada = {
      ...lista,
      itens: findAndMoveItemRecursivamente(lista.itens, itemId, direction)
    };

    console.log("Lista atualizada após mover o item:", listaAtualizada);

    // Atualiza a lista local ou envia para o backend
    updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);

  };

  // Função recursiva para encontrar e mover o item
  const findAndMoveItemRecursivamente = (itens, itemId, direction) => {
    const index = itens.findIndex(item => item.id === itemId);

    console.log("index", index);
    console.log("direction", direction);

    // Se o item for encontrado e o movimento for válido
    if (index !== -1) {

      console.log(" if (index !== -1)", (index !== -1));
      const targetIndex = index + direction;

      console.log("targetIndex", targetIndex);

      if (targetIndex >= 0 && targetIndex < itens.length) {
        const novosItens = [...itens];
        // Troca os itens de posição
        [novosItens[index], novosItens[targetIndex]] = [novosItens[targetIndex], novosItens[index]];
        return novosItens;
      }
      return itens; // Retorna a lista sem alteração se o movimento não for válido
    }

    // Recursão: percorre os itens aninhados
    return itens.map(item =>
      item.itens && item.itens.length > 0
        ? { ...item, itens: findAndMoveItemRecursivamente(item.itens, itemId, direction) }
        : item
    );
  };



  const atualizarItem = (item, nome, tipo) => {

    console.log("direto pra ca")

    const itemAtualizado = {
      ...item,
      nome: nome,
      tipo: tipo
    }
    console.log("itemAtualizado do modal")
    console.log(itemAtualizado)

    const listaAtualizada = {
      ...lista,
      itens: findAndUpdateItemRecursivamente(lista.itens, item.id, (item) => ({
        ...item,
        nome: nome,
        tipo: tipo,
      })),
    };

    console.log("listaAtualizada")
    console.log(listaAtualizada)
    updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);

  }

  const handleSave = (item, nome, tipo) => {
    console.log("entrei")
    console.log("nome")
    console.log(nome)
    console.log("tipo")
    console.log(tipo)
    atualizarItem(item, nome, tipo)
  }

  const handleResetar = async () => {
    // Função recursiva para resetar o campo 'completed' para 'false' em todos os itens, incluindo subitens
    const resetCompletedInItems = (itens) => {
      return itens.map(item => {
        const itemResetado = { ...item, completed: false };

        // Se o item tiver subitens, chamamos a função recursivamente para resetar também esses itens
        if (item.itens && Array.isArray(item.itens)) {
          itemResetado.itens = resetCompletedInItems(item.itens);
        }

        return itemResetado;
      });
    };

    // Resetar todos os itens da lista atual, incluindo subitens
    const itensResetados = resetCompletedInItems(lista.itens);

    console.log("Itens Resetados:", itensResetados);

    // Criar uma nova lista com os itens resetados
    const novaLista = {
      ...lista,
      itens: itensResetados
    };

    // Atualizar as listas locais, substituindo a lista resetada pela lista modificada
    const novasListas = listas.map(l => {
      if (l.id === lista.id) {
        return novaLista; // Substituir a lista atualizada
      }
      return l; // Manter as outras listas inalteradas
    });

    // Atualizar o estado das listas locais com as novas listas
    setListasLocal(novasListas);

    // Agora vamos salvar as novas listas no Firebase
    try {
      await setListas(user.uid, novasListas);
      console.log("Listas atualizadas com sucesso no Firebase.");
    } catch (error) {
      console.error("Erro ao atualizar as listas no Firebase:", error);
    }
  };


  return (
    <div className="modal">
      <h2>{lista.nome}</h2>
      <p>Tipo: {lista.tipo}</p>

      <FormAdicionarItem listas={listas} user={user} lista={lista} setListasLocal={setListasLocal} updateListas={updateListas} />
      <button onClick={handleResetar}>Resetar checklists</button>
      <ul>
        {lista.itens && lista.itens.map((item, index) => (
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
                onSave={(nome, tipo) => handleSave(itemEditando, nome, tipo)}
              />
            )}

          </li>
        ))}
      </ul>


      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default ListaModal;
