import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getListas, setListas } from '../../auth/firebaseListas.mjs'; 
import ListaForm from './ListaForm';
import Lista from './Lista';
import ListaModal from './ListaModal';
import './listas.css';
import { updateListas } from './listaUtils';
import { getAreas } from '../../auth/firebaseAreaSubarea';
import FiltroAreasListas from './FiltroAreasListas';
import FiltroTiposListas from './FiltroTiposListas';

const Listas = ({ user }) => {
  const [listas, setListasLocal] = useState([]);
  const [selectedLista, setSelectedLista] = useState(null);
  const [filteredListas, setFilteredListas] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - listas das listas:");
    console.log(listas)
  }, [listas]);

  useEffect(() => {
    const fetchListas = async () => {
      if (user && user.uid) {
        try {
          const listasFromFirebase = await getListas(user.uid);
          const areasData = await getAreas(user.uid);
          console.log("areasData.areas")
          console.log(areasData.areas)
          setAreas(areasData.areas);


          if (Array.isArray(listasFromFirebase)) {
            setListasLocal(listasFromFirebase);
          } else {
            console.error("O formato retornado de getListas não é um array.");
            setListasLocal([]);
          }
        } catch (error) {
          console.error("Erro ao buscar as listas:", error);
          setListasLocal([]);
        }
      } else {
        console.error("user.uid está indefinido.");
      }
    };

    fetchListas();
  }, [user]);

  useEffect(() => {
    // Atualiza `filteredListas` sempre que `listas` muda para garantir que todas as listas estejam exibidas inicialmente.
    setFilteredListas(listas);
  }, [listas]);

  useEffect(() => {
    if (selectedLista) {
      const listaAtualizada = listas.find((lista) => lista.id === selectedLista.id);
      if (listaAtualizada) {
        setSelectedLista(listaAtualizada);
      }
    }
  }, [listas, selectedLista?.id]);


  const addLista = async (novaLista) => {
    const novasListas = [...listas, { id: uuidv4(), ...novaLista, itens: [] }];
    setListasLocal(novasListas);
    await setListas(user.uid, novasListas);
  };

  const deleteLista = async (listaId) => {

    const novasListas = listas.filter((lista) => lista.id !== listaId);  // Remove a lista localmente

    setListasLocal(novasListas);  // Atualiza o estado local

    await setListas(user.uid, novasListas);  // Atualiza o Firebase
  };

  const reformarItensComTipo = async (listas) => {
    // Percorre cada lista

    console.log("listas entru")
    console.log(listas)

    const listasAtualizadas = listas.map((lista) => {

      const itensReformados = lista.itens.map((item) => {
        if (!item.tipo) {
          let tipo;
          tipo = "checklist"
  
  
          return {
            ...item,
            tipo, 
          };
        }
  
        return item;
      });

      return {
        ...lista,
        itens: itensReformados
      }

    });


    console.log("listasAtualizadas")
    console.log(listasAtualizadas)

    setListasLocal(listasAtualizadas); 

    

    await setListas(user.uid, listasAtualizadas);
  
    return listasAtualizadas;
  };

  const handleFilterChange = (selectedAreas) => {
    if (selectedAreas.length === 0) {
      setFilteredListas(listas);
    } else {
      const filtered = listas.filter(lista => selectedAreas.includes(lista.areaId));
      setFilteredListas(filtered);
    }
  };

  const handleFilterChangeTipo = (selectedTipos) => {
    if (selectedTipos.length === 0) {
      setFilteredListas(listas);
    } else {
      const filtered = listas.filter(lista => selectedTipos.includes(lista.tipo));
      setFilteredListas(filtered);
    }
  };
  

  const moveLista = async (listaId, direction) => {
    const index = listas.findIndex((lista) => lista.id === listaId);

    if (index < 0) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= listas.length) return;

    const updatedListas = [...listas];
    const [removedLista] = updatedListas.splice(index, 1);
    updatedListas.splice(newIndex, 0, removedLista);

    console.log(updatedListas)
    setListasLocal(updatedListas)
    await setListas(user.uid, updatedListas);
  };

 /* const handleToggleItem = (lista, itemId) => {

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
  };*/

  const handleToggleItem = (lista, itemId) => {
    const findAndToggleItem = (itens, targetId, toggleState) => {
      console.log("entrei")
      console.log("itens")
      console.log(itens)
      return itens.map(item => {
        if (item.id === targetId) {
          console.log("if (item.id === targetId)")
          console.log("item.nome")
          console.log(item.nome)
          // Inverte o estado de "completed" do item e propaga para todos os itens internos
          const newCompletedState = toggleState !== undefined ? toggleState : !item.completed;
          return {
            ...item,
            completed: newCompletedState,
            itens: item.itens ? findAndToggleItem(item.itens, null, newCompletedState) : item.itens
          };
        } else if (item.itens) {
          console.log("else if")
          // Verifica se todos os itens internos estão marcados e ajusta o estado do item pai
          const updatedSubItems = findAndToggleItem(item.itens, targetId, toggleState);
          const allSubItemsCompleted = updatedSubItems.every(subItem => subItem.completed);
          console.log("updatedSubItems")
          console.log(updatedSubItems)
          return {
            ...item,
            completed: allSubItemsCompleted,
            itens: updatedSubItems
          };
        }
        return item;
      });
    };
  
    const listaAtualizada = {
      ...lista,
      itens: findAndToggleItem(lista.itens, itemId)
    };
  
    console.log("listaAtualizada", listaAtualizada);
    updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);
  };
  

  const handleResetar = async (lista) => {
    console.log(" lista:", lista);
    const resetCompletedInItems = (itens) => {
      return itens.map(item => {
        const itemResetado = { ...item, completed: false };

        if (item.itens && Array.isArray(item.itens)) {
          itemResetado.itens = resetCompletedInItems(item.itens);
        }

        return itemResetado;
      });
    };

    const itensResetados = resetCompletedInItems(lista.itens);

    console.log("Itens Resetados:", itensResetados);

    const novaLista = {
      ...lista,
      itens: itensResetados
    };

    console.log(" novaLista:", novaLista);

    
    updateListas(user.uid, lista, listas, setListasLocal, novaLista)

  };
  

  return (
    <div>
      <ListaForm addLista={addLista} areas={areas} />
      <button onClick={() => reformarItensComTipo(listas)}>reformarItensComTipo</button>

      <FiltroAreasListas areas={areas} onFilterChange={handleFilterChange} />
      <FiltroTiposListas listas={listas} onFilterChangeTipo={handleFilterChangeTipo} />

      <div className="listas-container">
        {Array.isArray(filteredListas) && filteredListas.length > 0 ? (
          filteredListas.map((lista) => (
            <Lista
              key={lista.id}
              lista={lista}
              onDelete={deleteLista}
              onClick={() => setSelectedLista(lista)}
              user={user}
              listas={listas}
              setListasLocal={setListasLocal}
              areas={areas}
              onMove={moveLista}
              handleToggleItem={handleToggleItem}
              handleResetar={handleResetar}
            />
          ))
        ) : (
          <p>Nenhuma lista encontrada.</p>
        )}
      </div>

      {selectedLista && (
        <ListaModal
          lista={selectedLista}
          onClose={() => setSelectedLista(null)}
          updateListas={updateListas}
          user={user}
          setListasLocal={setListasLocal}
          listas={listas}
          areas={areas}
          handleToggleItem={handleToggleItem}
          handleResetar={handleResetar}
        />
      )}
    </div>
  );
};

export default Listas;
