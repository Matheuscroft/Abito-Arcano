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
  

  return (
    <div>
      <ListaForm addLista={addLista} areas={areas} />
      <button onClick={() => reformarItensComTipo(listas)}>reformarItensComTipo</button>

      <FiltroAreasListas areas={areas} onFilterChange={handleFilterChange} />

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
        />
      )}
    </div>
  );
};

export default Listas;
