import { db } from './firebase.mjs';
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';


export const getListaAtividades = async (userId) => {
  const atividadesRef = doc(db, 'atividades', userId);
  const atividadesDoc = await getDoc(atividadesRef);
  if (atividadesDoc.exists()) {
    return atividadesDoc.data();
  } else {
    return { userId, atividades: [] };
  }
};


/*export const setListaAtividades = async (userId, atividadesAtualizadas) => {
  try {
    const atividadesRef = doc(db, 'atividades', userId);
    await setDoc(atividadesRef, { userId, atividades: atividadesAtualizadas }, { merge: true });
    console.log("Atividades gerais substituídas com sucesso.");
  } catch (error) {
    console.error("Erro ao substituir as atividades gerais:", error);
  }
};*/

export const setListaAtividades = async (userId, atividadesAtualizadas) => {
  try {
    const atividadesRef = doc(db, 'atividades', userId);

    const atividadesDoc = await getDoc(atividadesRef);

    if (atividadesDoc.exists()) {

      await setDoc(atividadesRef, { userId, atividades: atividadesAtualizadas }, { merge: false });
    } else {

      await setDoc(atividadesRef, { userId, atividades: atividadesAtualizadas });
    }
  } catch (error) {
    console.error("Erro ao substituir as atividades gerais:", error);
  }
};



