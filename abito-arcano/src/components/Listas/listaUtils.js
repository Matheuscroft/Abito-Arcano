import { setListas } from '../../auth/firebaseListas.mjs';

export const updateListas = async (userId, listaId, listas, setListasLocal, item = null, toggleItem = null, deleteItem = null, newOrder = null) => {
    const listaIndex = listas.findIndex((lista) => lista.id === listaId);
    if (listaIndex === -1) return;
  
    let listaAtualizada = { ...listas[listaIndex] };
  
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
        listaAtualizada = {
          ...listaAtualizada,
          itens: newOrder 
        };
      }

    const novasListas = [
      ...listas.slice(0, listaIndex),
      listaAtualizada,
      ...listas.slice(listaIndex + 1),
    ];

    setListasLocal(novasListas);
    await setListas(userId, novasListas); 
  };
  

  export const updateLocalList = (listaLocal, novoItem = null, toggleItem = null, deleteItem = null) => {
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
  };
  
  
