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


export const getListaTarefas = async (userId) => {
  const q = query(collection(db, "tarefas"), where("userId", "==", userId));
  const tarefasSnapshot = await getDocs(q);
  const tarefasList = tarefasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return tarefasList;
};

export const addOrUpdateTarefasPorDia = async (data, tarefas, userId) => {
  try {
      const q = query(collection(db, 'dias'), where("data", "==", data), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, { tarefas });
      } else {
          await addDoc(collection(db, 'dias'), { data, tarefas, userId });
      }
  } catch (error) {
      console.error(`Erro ao atualizar as tarefas para o dia ${data}:`, error);
  }
};

export const addTarefa = async (tarefa, userId) => {
  const docRef = await addDoc(collection(db, "tarefas"), { ...tarefa, userId });
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