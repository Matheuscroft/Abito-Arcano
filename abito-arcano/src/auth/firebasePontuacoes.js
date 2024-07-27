
import { db } from './firebase';
import {
    updateDoc,
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';

/*export const getPontuacoes = async () => {
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
  };*/

  

export const getPontuacoes = async (userId) => {
    const pontuacaoRef = doc(db, "pontuacoes", userId);
    const pontuacaoDoc = await getDoc(pontuacaoRef);

    if (pontuacaoDoc.exists()) {
        return pontuacaoDoc.data().pontuacoes;
    } else {
        return [];
    }
};

export const updatePontuacao = async (userId, areaId, subareaId, pontos, data) => {
    const pontuacaoRef = doc(db, "pontuacoes", userId);

    const pontuacaoDoc = await getDoc(pontuacaoRef);

    if (pontuacaoDoc.exists()) {
        const dataAtual = pontuacaoDoc.data();
        let pontuacoes = dataAtual.pontuacoes || [];
        console.log("if")

        let pontuacaoDia = pontuacoes.find(p => p.data === data);
        if (!pontuacaoDia) {
            pontuacaoDia = {
                data: data,
                areas: []
            };
            pontuacoes.push(pontuacaoDia);
        }

        let areaData = pontuacaoDia.areas.find(a => a.areaId === areaId);
        if (!areaData) {
            areaData = {
                areaId: areaId,
                pontos: 0,
                subareas: []
            };
            pontuacaoDia.areas.push(areaData);
        }

        let subareaData = areaData.subareas.find(s => s.subareaId === subareaId);
        if (!subareaData) {
            subareaData = {
                subareaId: subareaId,
                pontos: 0
            };
            areaData.subareas.push(subareaData);
        }

        subareaData.pontos += pontos;
        areaData.pontos += pontos;

        console.log("Dados antes da atualização:", pontuacoes);

        await updateDoc(pontuacaoRef, { pontuacoes });
    } else {
        const novaPontuacao = {
            pontuacoes: [
                {
                    data: data,
                    areas: [
                        {
                            areaId: areaId,
                            pontos: pontos,
                            subareas: [
                                {
                                    subareaId: subareaId,
                                    pontos: pontos
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        await setDoc(pontuacaoRef, novaPontuacao);
    }
};

export const updatePontuacoes = async (userId, pontuacoes) => {
    const pontuacaoRef = doc(db, "pontuacoes", userId);
    await setDoc(pontuacaoRef, { pontuacoes });
};


export const resetPontuacao = async (areaId, userId, subareaId = null) => {
    const pontuacaoRef = doc(db, "pontuacoes", areaId);
    const pontuacaoDoc = await getDoc(pontuacaoRef);

    if (pontuacaoDoc.exists()) {
        const updatedPontuacoes = (subareaId)
            ? pontuacaoDoc.data().pontuacoes.map(p => p.subareaId === subareaId && p.userId === userId ? { ...p, pontos: 0 } : p)
            : pontuacaoDoc.data().pontuacoes.map(p => p.userId === userId ? { ...p, pontos: 0 } : p);
        await updateDoc(pontuacaoRef, { pontuacoes: updatedPontuacoes });
    } else {
        await setDoc(pontuacaoRef, { pontuacoes: [{ data: new Date().toISOString().split('T')[0], pontos: 0, subareaId, userId }], userId });
    }
};
