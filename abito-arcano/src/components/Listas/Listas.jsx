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
import { Box, Button, Flex } from '@chakra-ui/react';

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
    console.log("novaLista addLista")
    console.log(novaLista)
    const areaId = areas.find(area => area.nome === novaLista.area).id;
    const novasListas = [...listas, { id: uuidv4(), ...novaLista, areaId, itens: [] }];
    setListasLocal(novasListas);
    await setListas(user.uid, novasListas);
  };

  const deleteLista = async (listaId) => {

    const novasListas = listas.filter((lista) => lista.id !== listaId);  // Remove a lista localmente

    setListasLocal(novasListas);  // Atualiza o estado local

    await setListas(user.uid, novasListas);  // Atualiza o Firebase
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
          // Inverte o estado de "finalizada" do item e propaga para todos os itens internos
          const newFinalizadaState = toggleState !== undefined ? toggleState : !item.finalizada;
          return {
            ...item,
            finalizada: newFinalizadaState,
            itens: item.itens ? findAndToggleItem(item.itens, null, newFinalizadaState) : item.itens
          };
        } else if (item.itens) {
          console.log("else if")
          // Verifica se todos os itens internos estão marcados e ajusta o estado do item pai
          const updatedSubItems = findAndToggleItem(item.itens, targetId, toggleState);
          const allSubItemsFinalizada = updatedSubItems.every(subItem => subItem.finalizada);
          console.log("updatedSubItems")
          console.log(updatedSubItems)
          return {
            ...item,
            finalizada: allSubItemsFinalizada,
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
    const resetFinalizadaInItems = (itens) => {
      return itens.map(item => {
        const itemResetado = { ...item, finalizada: false };

        if (item.itens && Array.isArray(item.itens)) {
          itemResetado.itens = resetFinalizadaInItems(item.itens);
        }

        return itemResetado;
      });
    };

    const itensResetados = resetFinalizadaInItems(lista.itens);

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

      <FiltroAreasListas areas={areas} onFilterChange={handleFilterChange} />
      <FiltroTiposListas listas={listas} onFilterChangeTipo={handleFilterChangeTipo} />

      <Flex wrap="wrap" gap={10}>
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
      </Flex>

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
