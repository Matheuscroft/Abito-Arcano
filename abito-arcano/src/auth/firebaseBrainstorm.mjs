import { db } from './firebase.mjs';
import { doc, getDoc, setDoc } from "firebase/firestore";

export const getBrainstormList = async (userId) => {
    const docRef = doc(db, 'brainstorms', userId); 
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().cards;
    }
    return null;
  };
  
  export const setBrainstormList = async (userId, cards) => {
    const docRef = doc(db, 'brainstorms', userId); 
    await setDoc(docRef, { cards });
  };
  