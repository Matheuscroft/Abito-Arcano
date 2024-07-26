import { db } from './firebase';
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
      console.log("Documento existente. Substituindo a lista de atividades.");

      await setDoc(atividadesRef, { userId, atividades: atividadesAtualizadas }, { merge: false });
      console.log("Atividades gerais substituídas com sucesso.");
    } else {
      console.log("Documento não existente. Criando com a nova lista de atividades:");
      console.log(atividadesAtualizadas);

      await setDoc(atividadesRef, { userId, atividades: atividadesAtualizadas });
      console.log("Documento de atividades criado com sucesso.");
    }
  } catch (error) {
    console.error("Erro ao substituir as atividades gerais:", error);
  }
};



