import { setListas } from '../../auth/firebaseListas.mjs';

/*export const updateListas = async (userId, listaId, listas, setListasLocal, item = null, toggleItem = null, deleteItem = null, newOrder = null) => {
    const listaIndex = listas.findIndex((lista) => lista.id === listaId);
    if (listaIndex === -1) return;
  
    let listaAtualizada = { ...listas[listaIndex] };

    console.log("newOrder")
    console.log(newOrder)
  
    if (item) {
      
      listaAtualizada = {
        ...listaAtualizada,
        itens: [...listaAtualizada.itens, item]
      };
    }
  
    if (toggleItem) {
      listaAtualizada = {
        ...listaAtualizada,
        itens: listaAtualizada.itens.map((checkItem) =>
          checkItem.id === toggleItem.id ? { ...checkItem, completed: !checkItem.completed } : checkItem
        )
      };
    }
  
    if (deleteItem) {
      listaAtualizada = {
        ...listaAtualizada,
        itens: listaAtualizada.itens.filter((checkItem) => checkItem.id !== deleteItem.id)
      };
    }

    if (newOrder) {
      console.log("ifnewordrt")
    
        listaAtualizada = {
          ...listaAtualizada,
          itens: newOrder 
        };
        console.log("listaAtualizada")
        console.log(listaAtualizada)
      }

    const novasListas = [
      ...listas.slice(0, listaIndex),
      listaAtualizada,
      ...listas.slice(listaIndex + 1),
    ];

    console.log("novasListas")
        console.log(novasListas)

    setListasLocal(novasListas);
    await setListas(userId, novasListas); 
  };*/

/*export const updateListas = async (
  userId,
  listaId,
  listas,
  setListasLocal,
  item = null,
  toggleItem = null,
  deleteItem = null,
  newOrder = null
) => {
  const findAndUpdate = (lista, listaId) => {
    if (lista.id === listaId) {
      // Aplica a atualização diretamente se encontrar a lista
      let listaAtualizada = { ...lista };

      if (item) {
        listaAtualizada = {
          ...listaAtualizada,
          itens: [...(listaAtualizada.itens || []), item]
        };
      }

      if (toggleItem) {
        listaAtualizada = {
          ...listaAtualizada,
          itens: toggleItemInItems(listaAtualizada.itens, toggleItem.id),
        };
      }

      /*if (deleteItem) {
        listaAtualizada = {
          ...listaAtualizada,
          itens: listaAtualizada.itens.filter((checkItem) => checkItem.id !== deleteItem.id)
        };
      }

      if (deleteItem) {
        listaAtualizada = {
          ...listaAtualizada,
          itens: deleteItemFromItems(listaAtualizada.itens, deleteItem.id)
        };
      }

      if (newOrder) {
        listaAtualizada = {
          ...listaAtualizada,
          itens: newOrder
        };
      }

      return listaAtualizada;
    }

    // Verifica se há sublistas e aplica recursivamente
    /*if (lista.itens && lista.itens.length > 0) {
      return {
        ...lista,
        itens: lista.itens.map((subItem) => {
          if (subItem.id === listaId) {
            return findAndUpdate(subItem, listaId);
          } else if (subItem.itens) {
            return findAndUpdate(subItem, listaId);
          }
          return subItem;
        })
          .filter(Boolean)
      };
    }

    return lista;
  };
    if (lista.itens && lista.itens.length > 0) {
      return {
        ...lista,
        itens: lista.itens.map((subItem) =>
          findAndUpdate(subItem, listaId)
        )
      };
    }

    return lista;
  };


  const toggleItemInItems = (itens, toggleItemId) => {
    return itens.map(item => {
      if (item.id === toggleItemId) {
        return { ...item, completed: !item.completed };
      }
      // Verifica se há subitens e aplica recursivamente
      if (item.itens) {
        return { ...item, itens: toggleItemInItems(item.itens, toggleItemId) };
      }
      return item;
    });
  };

  const deleteItemFromItems = (itens, deleteItemId) => {
    return itens.reduce((acc, item) => {
      if (item.id === deleteItemId) {
        return acc; // Exclui o item
      }
      const newItem = { ...item };
      if (newItem.itens && Array.isArray(newItem.itens)) {
        newItem.itens = deleteItemFromItems(newItem.itens, deleteItemId);
      }
      acc.push(newItem);
      return acc;
    }, []);
  };

  // Atualiza a lista principal com a função findAndUpdate para listas e sublistas
  const novasListas = listas.map((lista) => findAndUpdate(lista, listaId));

  console.log("novasListas")
  console.log(novasListas)

  const listasFiltradas = JSON.parse(JSON.stringify(novasListas, (key, value) => (value === undefined ? null : value)));

  console.log("listasFiltradas")
  console.log(listasFiltradas)

  setListasLocal(listasFiltradas);
  await setListas(userId, listasFiltradas);
};*/
export const updateListas = async (userId, lista, listas, setListasLocal, novaLista) => {

  const novasListas = listas.map(l => {
    if (l.id === lista.id) {

      return novaLista;
    }
    return l;
  });

  const listasFiltradas = JSON.parse(JSON.stringify(novasListas, (key, value) => (value === undefined ? null : value)));

  console.log("listasFiltradas")
  console.log(listasFiltradas)

  setListasLocal(listasFiltradas);
  await setListas(userId, listasFiltradas);
};



/*export const updateLocalList = (listaLocal, novoItem = null, toggleItem = null, deleteItem = null) => {
  if (novoItem) {
    return {
      ...listaLocal,
      itens: [...listaLocal.itens, novoItem],
    };
  } else if (toggleItem) {
    const itensAtualizados = listaLocal.itens.map((item) =>
      item.id === toggleItem.id ? { ...item, completed: !item.completed } : item
    );
    return {
      ...listaLocal,
      itens: itensAtualizados,
    };
  } else if (deleteItem) {
    const itensAtualizados = listaLocal.itens.filter((item) => item.id !== deleteItem.id);
    return {
      ...listaLocal,
      itens: itensAtualizados,
    };
  }
 
  return listaLocal;
};*/

export const updateLocalList = (listaLocal, novoItem = null, toggleItem = null, deleteItem = null) => {
  const atualizarLista = (lista) => {

    if (!lista || !Array.isArray(lista.itens)) {
      console.error('Lista ou itens não definidos ou não é um array');
      return lista; // Retorne a lista inalterada
    }

    if (novoItem) {
      return {
        ...lista,
        itens: [...lista.itens, novoItem]
      };
    } else if (toggleItem) {
      return {
        ...lista,
        itens: lista.itens.map((item) =>
          item.id === toggleItem.id
            ? { ...item, completed: !item.completed }
            : item.itens
              ? { ...item, itens: atualizarLista(item).itens }
              : item
        )
      };
    } else if (deleteItem) {
      return {
        ...lista,
        itens: lista.itens.filter((item) => item.id !== deleteItem.id)
      };
    }
    return lista;
  };

  return atualizarLista(listaLocal);
};



