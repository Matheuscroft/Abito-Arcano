import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getListas, setListas } from '../../auth/firebaseListas.mjs'; 
import ListaForm from './ListaForm';
import Lista from './Lista';
import ListaModal from './ListaModal';
import './listas.css';
import { updateListas } from './listaUtils';

const Listas = ({ user }) => {
  const [listas, setListasLocal] = useState([]);
  const [selectedLista, setSelectedLista] = useState(null);

  useEffect(() => {
    const fetchListas = async () => {
      if (user && user.uid) {
        try {
          const listasFromFirebase = await getListas(user.uid);
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
  

  // Adicionar item à checklist
  /*const addChecklistItem = async (listaId, novoItem) => {
    const listaIndex = listas.findIndex((lista) => lista.id === listaId);
    if (listaIndex === -1) return;

    const novoChecklistItem = {
      id: uuidv4(),
      nome: novoItem,
      completed: false
    };

    const listaAtualizada = {
      ...listas[listaIndex],
      itens: [...listas[listaIndex].itens, novoChecklistItem]
    };

    const novasListas = [
      ...listas.slice(0, listaIndex),
      listaAtualizada,
      ...listas.slice(listaIndex + 1),
    ];

    setListasLocal(novasListas);
    await setListas(user.uid, novasListas);
  };*/

  /*const addChecklistItem = (listaId, novoItem) => {
    updateListas(user.uid, listaId, listas, setListasLocal, novoItem);
  };*/

  // Marcar item de checklist como concluído
  /*const toggleChecklistItem = async (listaId, itemId) => {
    const listaIndex = listas.findIndex((lista) => lista.id === listaId);
    if (listaIndex === -1) return;

    const lista = listas[listaIndex];
    const itemIndex = lista.itens.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const itensAtualizados = [...lista.itens];
    itensAtualizados[itemIndex].completed = !itensAtualizados[itemIndex].completed;

    const listaAtualizada = { ...lista, itens: itensAtualizados };

    const novasListas = [
      ...listas.slice(0, listaIndex),
      listaAtualizada,
      ...listas.slice(listaIndex + 1),
    ];

    setListasLocal(novasListas);
    await setListas(user.uid, novasListas);
  };*/

  /*const toggleChecklistItem = (listaId, itemId) => {
    updateListas(user.uid, listaId, listas, setListasLocal, null, itemId);
  };*/

  return (
    <div>
      <ListaForm addLista={addLista} />
      <button onClick={() => reformarItensComTipo(listas)}>reformarItensComTipo</button>

      <div className="listas-container">
        {Array.isArray(listas) && listas.length > 0 ? (
          listas.map((lista) => (
            <Lista
              key={lista.id}
              lista={lista}
              onDelete={deleteLista}
              onClick={() => setSelectedLista(lista)}
              user={user}
              listas={listas}
              setListasLocal={setListasLocal}
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
        />
      )}
    </div>
  );
};

export default Listas;
