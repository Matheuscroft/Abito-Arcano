import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDoc
} from 'firebase/firestore';

export const getListaTarefas = async () => {
    const tarefasSnapshot = await getDocs(collection(db, "tarefas"));
    const tarefasList = tarefasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tarefasList;
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