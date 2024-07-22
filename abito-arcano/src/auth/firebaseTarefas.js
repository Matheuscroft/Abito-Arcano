import { db } from './firebase';
import {
    deleteDoc,
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';


export const getListaTarefas = async (userId) => {
    try {
        const tarefasRef = doc(db, "tarefas", userId);
        const tarefasDoc = await getDoc(tarefasRef);

        if (tarefasDoc.exists()) {
            return tarefasDoc.data().tarefas || [];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar a lista de tarefas:", error);
        return [];
    }
};


export const addTarefa = async (tarefa, userId) => {
    try {
        const tarefasRef = doc(db, "tarefas", userId);
        const tarefasDoc = await getDoc(tarefasRef);

        let tarefas = [];
        if (tarefasDoc.exists()) {
            tarefas = tarefasDoc.data().tarefas || [];
        }

        const novaTarefa = { ...tarefa, id: tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1 };
        tarefas.push(novaTarefa);

        await setDoc(tarefasRef, { userId, tarefas });

        await updateDiasComNovaTarefa(novaTarefa, userId);

        return novaTarefa;
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        throw error;
    }
};

const updateDiasComNovaTarefa = async (novaTarefa, userId) => {
    try {
        const diasRef = doc(db, 'dias', userId);
        const diasDoc = await getDoc(diasRef);

        if (!diasDoc.exists()) {
            console.error('Documento de dias não encontrado');
            return;
        }

        const dadosDias = diasDoc.data();
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        const amanhaStr = amanha.toLocaleDateString('pt-BR');

        const diasAtualizados = dadosDias.dias.map(dia => {
            const diaData = new Date(dia.data.split('/').reverse().join('-'));
            if (diaData >= amanha) {
                return {
                    ...dia,
                    tarefas: [...dia.tarefas, novaTarefa]
                };
            }
            return dia;
        });

        await setDoc(diasRef, { userId, dias: diasAtualizados });
        console.log("Dias atualizados com a nova tarefa");

        return diasAtualizados;
    } catch (error) {
        console.error("Erro ao atualizar dias com nova tarefa:", error);
    }
};




export const updateTarefa = async (id, tarefaAtualizada, userId, dias) => {
    try {
        const tarefasRef = doc(db, "tarefas", userId);
        const tarefasDoc = await getDoc(tarefasRef);

        if (!tarefasDoc.exists()) {
            console.error("Documento de tarefas não encontrado");
            return null;
        }

        const tarefas = tarefasDoc.data().tarefas || [];
        const tarefasAtualizadas = tarefas.map(tarefa => tarefa.id === id ? { ...tarefa, ...tarefaAtualizada } : tarefa);

        await setDoc(tarefasRef, { userId, tarefas: tarefasAtualizadas });

        const diasAtualizados = dias.map(dia => {
            const diaData = new Date(dia.data.split('/').reverse().join('-')).toISOString().split('T')[0];
            const dataAtual = new Date().toISOString().split('T')[0];
            if (diaData >= dataAtual) {
                const tarefasAtualizadasDia = dia.tarefas.map(tarefa => tarefa.id === id ? { ...tarefa, ...tarefaAtualizada } : tarefa);
                return { ...dia, tarefas: tarefasAtualizadasDia };
            }
            return dia;
        });

        await setDoc(doc(db, 'dias', userId), { userId, dias: diasAtualizados });
        return { id, ...tarefaAtualizada };
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw error;
    }
};



export const deleteTarefa = async (id) => {
    await deleteDoc(doc(db, "tarefas", id));
};

export const substituirTarefasGerais = async (userId, tarefasAtualizadas) => {
    try {
        const tarefasRef = doc(db, "tarefas", userId);

        const tarefasDoc = await getDoc(tarefasRef);

        if (tarefasDoc.exists()) {
            console.log("Estado atual das tarefas:");
            console.log(tarefasDoc.data().tarefas);

            console.log("Nova lista de tarefas:");
            console.log(tarefasAtualizadas);

            await setDoc(tarefasRef, { userId, tarefas: tarefasAtualizadas }, { merge: true });
            console.log("Tarefas gerais substituídas com sucesso.");
        } else {
            console.log("Documento não existente. Criando com a nova lista de tarefas:");
            console.log(tarefasAtualizadas);

            await setDoc(tarefasRef, { userId, tarefas: tarefasAtualizadas });
            console.log("Documento de tarefas criado com sucesso.");
        }
    } catch (error) {
        console.error("Erro ao substituir as tarefas gerais:", error);
    }
};
