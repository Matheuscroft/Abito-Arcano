import { db } from './firebase';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDoc,
    setDoc
} from 'firebase/firestore';


export const getListaTarefas = async () => {
    const tarefasSnapshot = await getDocs(collection(db, "tarefas"));
    const tarefasList = tarefasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tarefasList;
};

/*export const getTarefasPorDia = async (data) => {
  const tarefasSnapshot = await getDocs(collection(db, "tarefasPorDia", data));
  const tarefasList = tarefasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return tarefasList;
};*/

export const getTarefasPorDia = async (data) => {
  const docRef = doc(db, 'tarefasPorDia', data);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().tarefas || [];
  } else {
    return [];
  }
};

export const addOrUpdateTarefasPorDia = async (data, tarefas) => {
  try {
    
    const q = query(collection(db, 'dias'), where("data", "==", data));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { tarefas });
    } else {
      console.error(`Nenhum documento encontrado para a data ${data}`);
    }
  } catch (error) {
    console.error(`Erro ao atualizar as tarefas para o dia ${data}:`, error);
  }
};



export const addTarefa = async (tarefa) => {
    const docRef = await addDoc(collection(db, "tarefas"), tarefa);
    return { id: docRef.id, ...tarefa };
};

export const updateTarefa = async (id, tarefaAtualizada) => {
    const tarefaRef = doc(db, "tarefas", id);
    await updateDoc(tarefaRef, tarefaAtualizada);
    const tarefaAtualizadaDoc = await getDoc(tarefaRef);
    return { id: tarefaAtualizadaDoc.id, ...tarefaAtualizadaDoc.data() };
};


export const deleteTarefa = async (id) => {
    await deleteDoc(doc(db, "tarefas", id));
};


export const getPontuacoes = async () => {
    const pontuacoesSnapshot = await getDocs(collection(db, "pontuacoes"));
    const pontuacoesList = pontuacoesSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().pontos;
        return acc;
    }, {});
    return pontuacoesList;
};

export const updatePontuacao = async (area, pontos, reset = false) => {
    
    const pontuacaoRef = doc(db, "pontuacoes", area);
   
    if (reset) {
      await setDoc(pontuacaoRef, { pontos: 0 });
    } else {
      const pontuacaoDoc = await getDoc(pontuacaoRef);
      if (pontuacaoDoc.exists()) {
        await updateDoc(pontuacaoRef, { pontos: pontuacaoDoc.data().pontos + pontos });
      } else {
        await setDoc(pontuacaoRef, { pontos });
      }
    }
  };
  

export const getAreas = async () => {
    const querySnapshot = await getDocs(collection(db, "areas"));
    const areas = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return areas;
};

export const getCorArea = async (nomeArea) => {
    try {
      const areas = await getAreas();
      const areaEncontrada = areas.find(a => a.nome === nomeArea);
      return areaEncontrada ? areaEncontrada.cor : '#000'; 
    } catch (error) {
      console.error('Erro ao buscar cor da área:', error);
      return '#000'; 
    }
  };


export const addArea = async (area) => {
    const docRef = await addDoc(collection(db, "areas"), area);
    return { ...area, id: docRef.id };
};

export const updateArea = async (id, area) => {
    const docRef = doc(db, "areas", id);
    await updateDoc(docRef, area);
};

export const deleteArea = async (id) => {
    const docRef = doc(db, "areas", id);
    await deleteDoc(docRef);
};

export const addSubarea = async (areaId, subarea) => {
  try {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    
    if (!areaSnapshot.exists()) {
      throw new Error(`Document with ID ${areaId} does not exist.`);
    }

    const subareaDocRef = await addDoc(collection(areaRef, "subareas"), subarea);
    const subareaId = subareaDocRef.id;

    // Atualiza a área para incluir a nova subárea
    const updatedArea = {
      ...areaSnapshot.data(),
      subareas: [...(areaSnapshot.data().subareas || []), { id: subareaId, ...subarea }]
    };
    await updateDoc(areaRef, updatedArea);

    return { id: subareaId, ...subarea }; // Retorna o objeto com o ID gerado
  } catch (error) {
    console.error("Erro ao adicionar subárea:", error);
    throw error;
  }
};

  
export const updateSubarea = async (areaId, subareaId, subarea) => {
    try {
      const areaRef = doc(db, "areas", areaId);
      const areaSnapshot = await getDoc(areaRef);
      
      if (!areaSnapshot.exists()) {
        throw new Error(`Document with ID ${areaId} does not exist.`);
      }
  
      const subareaRef = doc(collection(areaRef, "subareas"), subareaId);
      await updateDoc(subareaRef, subarea);
  
      // Atualiza a área para refletir a subárea atualizada
      const updatedSubareas = areaSnapshot.data().subareas.map(sa =>
        sa.id === subareaId ? { ...sa, ...subarea } : sa
      );
      const updatedArea = { ...areaSnapshot.data(), subareas: updatedSubareas };
      await updateDoc(areaRef, updatedArea);
  
      return { id: subareaId, ...subarea }; // Retorna o objeto atualizado
    } catch (error) {
      console.error("Erro ao atualizar subárea:", error);
      throw error;
    }
  };
  
  
  export const deleteSubarea = async (areaId, subareaId) => {
    try {
      const areaRef = doc(db, "areas", areaId);
      const areaSnapshot = await getDoc(areaRef);
      
      if (!areaSnapshot.exists()) {
        throw new Error(`Document with ID ${areaId} does not exist.`);
      }
  
      const subareaRef = doc(collection(areaRef, "subareas"), subareaId);
      await deleteDoc(subareaRef);
  
      // Remove a subárea da lista de subáreas da área
      const updatedSubareas = areaSnapshot.data().subareas.filter(sa => sa.id !== subareaId);
      const updatedArea = { ...areaSnapshot.data(), subareas: updatedSubareas };
      await updateDoc(areaRef, updatedArea);
  
      return subareaId;
    } catch (error) {
      console.error("Erro ao excluir subárea:", error);
      throw error;
    }
  };
  
  

export const addProjeto = async (areaId, subareaId, projeto) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.map(sa => sa.id === subareaId ? { ...sa, projetos: [...(sa.projetos || []), projeto] } : sa);
    await updateDoc(areaRef, { subareas });
    return projeto;
};

export const updateProjeto = async (areaId, subareaId, projetoId, projeto) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.map(sa =>
        sa.id === subareaId ? {
            ...sa,
            projetos: sa.projetos.map(p => p.id === projetoId ? projeto : p)
        } : sa
    );
    await updateDoc(areaRef, { subareas });
};

export const deleteProjeto = async (areaId, subareaId, projetoId) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.map(sa =>
        sa.id === subareaId ? {
            ...sa,
            projetos: sa.projetos.filter(p => p.id !== projetoId)
        } : sa
    );
    await updateDoc(areaRef, { subareas });
};

export const getListaAtividades = async () => {
    const q = query(collection(db, 'atividades'));
    const querySnapshot = await getDocs(q);
    const atividades = [];
    querySnapshot.forEach((doc) => {
      atividades.push({ id: doc.id, ...doc.data() });
    });
    return atividades;
  };
  
  export const addAtividade = async (atividade) => {
    const docRef = await addDoc(collection(db, 'atividades'), atividade);
    return { id: docRef.id, ...atividade };
  };
  
  export const updateAtividade = async (id, atividade) => {
    const atividadeRef = doc(db, 'atividades', id);
    await updateDoc(atividadeRef, atividade);
    return { id, ...atividade };
  };
  
  export const deleteAtividade = async (id) => {
    const atividadeRef = doc(db, 'atividades', id);
    await deleteDoc(atividadeRef);
  };

export const addDia = async (dia) => {
    try {
        await addDoc(collection(db, 'dias'), { data: dia });
    } catch (error) {
        console.error('Erro ao adicionar dia: ', error);
    }
};

export const getDias = async () => {
  try {
      const q = query(collection(db, 'dias'));
      const querySnapshot = await getDocs(q);
      const dias = [];
      querySnapshot.forEach((doc) => {
          dias.push(doc.data());
      });
      return dias.sort((a, b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-')));
  } catch (error) {
      console.error('Erro ao buscar dias: ', error);
      return [];
  }
};


export const inserirDias = async (novosDias) => {
  try {
      const diasRef = collection(db, 'dias');

      const querySnapshot = await getDocs(diasRef);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      const addPromises = novosDias.map(dia => addDoc(diasRef, dia));
      await Promise.all(addPromises);

      console.log('Dias resetados com sucesso');
  } catch (error) {
      console.error('Erro ao resetar dias: ', error);
  }
};


export const setarDataAtual = async (data) => {
  try {
      await setDoc(doc(db, 'config', 'dataAtual'), { dataAtual: data });
  } catch (error) {
      console.error('Erro ao definir data atual: ', error);
  }
};

export const setarDataAtualParaDia = async (dia, valor) => {
  try {
      const docRef = doc(db, 'dias', dia);
      await setDoc(docRef, { dataAtual: valor }, { merge: true });
  } catch (error) {
      console.error('Erro ao definir data atual para dia: ', error);
  }
};

export const getDiaAtual = async () => {
  try {
      const diasSnapshot = await getDocs(collection(db, 'dias'));
    
      const diaAtualDoc = diasSnapshot.docs.find(doc => doc.data().dataAtual === true);
      console.log('Dia atual encontrado:', diaAtualDoc ? diaAtualDoc.id : 'Nenhum dia atual encontrado');
      return diaAtualDoc ? diaAtualDoc.id : null;
  } catch (error) {
      console.error('Erro ao buscar dia atual: ', error);
      return null;
  }
};

export const setHoraTrocaFirebase = async (hora) => {
  const docRef = doc(db, 'config', 'horaTroca');
  await setDoc(docRef, { hora });
};

export const getHoraTrocaFirebase = async () => {
  const docRef = doc(db, 'config', 'horaTroca');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
      return docSnap.data().hora;
  } else {
      return null;
  }
};

