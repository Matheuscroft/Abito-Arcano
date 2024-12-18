import { db } from './firebase.mjs';
import {
    doc,
    getDoc,
    setDoc
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



export const inserirDias = async (userId, dias) => {
    try {
        const diasRef = doc(db, 'dias', userId);
        await setDoc(diasRef, { userId, dias });
        console.log('Dias resetados com sucesso');
        console.log(dias);
    } catch (error) {
        console.error('Erro ao resetar dias: ', error);
    }
};


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