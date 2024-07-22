import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';


export const getListaAtividades = async (userId) => {
  const q = query(collection(db, 'atividades'), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const atividades = [];
  querySnapshot.forEach((doc) => {
    atividades.push({ id: doc.id, ...doc.data() });
  });
  return atividades;
};

export const addAtividade = async (atividade, userId) => {
  const docRef = await addDoc(collection(db, 'atividades'), { ...atividade, userId });
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