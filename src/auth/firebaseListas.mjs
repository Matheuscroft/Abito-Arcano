import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase.mjs';

export const getListas = async (userId) => {
  const listasRef = doc(db, 'listas', userId);
  const listasDoc = await getDoc(listasRef);
  if (listasDoc.exists()) {
    const data = listasDoc.data();
    return data.listas || [];  
  } else {
    return [];  
  }
};

export const setListas = async (userId, listasAtualizadas) => {
  const listasRef = doc(db, 'listas', userId);
  await setDoc(listasRef, { listas: listasAtualizadas }, { merge: true });
};
