import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    getDoc,
    setDoc
} from 'firebase/firestore';

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