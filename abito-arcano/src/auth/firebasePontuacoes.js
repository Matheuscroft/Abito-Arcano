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
    getDoc,
    setDoc
} from 'firebase/firestore';





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