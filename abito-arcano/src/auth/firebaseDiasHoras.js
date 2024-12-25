import { db } from './firebase.mjs';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc
} from 'firebase/firestore';


export const getDias = async (userId) => {
    try {
        if (!userId) {
            console.error('userId não fornecido');
            return [];
        }

        const docRef = doc(db, 'dias', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const dias = data.dias || [];
            return dias.sort((a, b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-')));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar dias: ', error);
        return [];
    }
};

/*export const getDias = async (userId) => {
    try {

        console.log('getDias - userId:', userId);

        if (!userId) {
            console.error('userId não fornecido');
            return [];
        }

        const userRef = doc(db, 'users', userId);
        const diasCollectionRef = collection(userRef, 'dias');
        
        console.log('getDias - Buscando grupos de dias...');

        const querySnapshot = await getDocs(diasCollectionRef, { source: 'server' });

        if (querySnapshot.empty) {
            console.log('getDias - Nenhum grupo de dias encontrado.');
            return [];
        }
        
        const todosOsDias = querySnapshot.docs.flatMap((doc) => {
            const data = doc.data();
            console.log(`getDias - Documento resgatado: ${doc.id}`, data);
            return data.dias || [];
        });

        const diasUnicos = Array.from(new Set(todosOsDias.map(dia => dia.data))).map(data => {
            return todosOsDias.find(dia => dia.data === data);
        });

        // Ordenar os dias por data
        const diasOrdenados = diasUnicos.sort(
            (a, b) => new Date(a.data.split('/').reverse().join('-')) - new Date(b.data.split('/').reverse().join('-'))
        );

        console.log('getDias - Dias ordenados:', diasOrdenados); // Log da lista final ordenada

        return diasOrdenados;
    } catch (error) {
        console.error('Erro ao buscar dias: ', error);
        return [];
    }
};*/





export const inserirDias = async (userId, dias) => {
    try {
      const diasRef = doc(db, 'dias', userId);
  
      // Atualiza o campo 'dias' no documento do usuário no Firestore
      await updateDoc(diasRef, { dias });
  
      console.log('Dias atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar os dias:', error);
    }
  };

/*export const inserirDias = async (userId, dias) => {
    try {
        console.log('inserirDias - userId:', userId);
        console.log('inserirDias - Dias recebidos:', dias);

        const userRef = doc(db, 'users', userId);
        const diasCollectionRef = collection(userRef, 'dias');
        
        const diasPorMes = dias.reduce((acumulador, dia) => {
            const [diaNum, mes, ano] = dia.data.split('/');
            const mesAno = `${mes}_${ano}`; // Formato: MM_YYYY
            if (!acumulador[mesAno]) {
                acumulador[mesAno] = [];
            }
            acumulador[mesAno].push(dia);
            return acumulador;
        }, {});

        // Substituir cada mês no Firestore
        for (const [mesAno, diasDoMes] of Object.entries(diasPorMes)) {
            console.log(`inserirDias - Substituindo documento do mês: ${mesAno}`);
            const mesRef = doc(diasCollectionRef, mesAno);
            await setDoc(mesRef, { dias: diasDoMes }); // Sobrescreve o documento inteiro
        }


        console.log('inserirDias - Dias salvos com sucesso');
    } catch (error) {
        console.error('Erro ao resetar dias: ', error);
    }
};*/



export const setHoraTrocaFirebase = async (userId, hora) => {
    const docRef = doc(db, 'userConfigs', userId);
    await setDoc(docRef, { horaTroca: hora }, { merge: true });
};

export const getHoraTrocaFirebase = async (userId) => {
    const docRef = doc(db, 'userConfigs', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().horaTroca;
    } else {
        return null;
    }
};