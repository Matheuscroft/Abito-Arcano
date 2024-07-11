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
    getDoc,
    setDoc
} from 'firebase/firestore';


export const getListaTarefas = async () => {
    const tarefasSnapshot = await getDocs(collection(db, "tarefas"));
    const tarefasList = tarefasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tarefasList;
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


export const updatePontuacao = async (area, pontos) => {
    const pontuacaoRef = doc(db, "pontuacoes", area);
    const pontuacaoDoc = await getDoc(pontuacaoRef);
    if (pontuacaoDoc.exists()) {
        await updateDoc(pontuacaoRef, { pontos: pontuacaoDoc.data().pontos + pontos });
    } else {
        await setDoc(pontuacaoRef, { pontos });
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
      return areaEncontrada ? areaEncontrada.cor : '#000'; // Retorna a cor da área encontrada ou uma cor padrão
    } catch (error) {
      console.error('Erro ao buscar cor da área:', error);
      return '#000'; // Retorna uma cor padrão em caso de erro
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
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas || [];
    subareas.push(subarea);
    await updateDoc(areaRef, { subareas });
    return subarea;
};

export const updateSubarea = async (areaId, subareaId, subarea) => {
    try {
        const areaRef = doc(db, "areas", areaId);
        const areaSnapshot = await getDoc(areaRef);
        
        if (!areaSnapshot.exists()) {
            throw new Error(`Document with ID ${areaId} does not exist.`);
        }

        const areaData = areaSnapshot.data();
        
        
        const updatedSubareas = areaData.subareas.map(sa =>
            sa.id === subareaId ? { ...sa, ...subarea } : sa
        );

        await updateDoc(areaRef, { subareas: updatedSubareas });
        
    } catch (error) {
        console.error("Erro ao atualizar subárea:", error);
        throw error;
    }
};

export const deleteSubarea = async (areaId, subareaId) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.filter(sa => sa.id !== subareaId);
    await updateDoc(areaRef, { subareas });
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

