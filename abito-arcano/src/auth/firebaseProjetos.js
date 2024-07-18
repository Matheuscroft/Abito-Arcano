import { db } from './firebase';
import {
    updateDoc,
    doc,
    getDoc
} from 'firebase/firestore';


export const addProjeto = async (areaId, subareaId, projeto) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.map(sa => sa.id === subareaId ? { ...sa, projetos: [...(sa.projetos || []), projeto] } : sa);
    await updateDoc(areaRef, { subareas });
    return projeto;
};

export const updateProjeto = async (areaId, subareaId, projetoId, projeto) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.map(sa =>
        sa.id === subareaId ? {
            ...sa,
            projetos: sa.projetos.map(p => p.id === projetoId ? projeto : p)
        } : sa
    );
    await updateDoc(areaRef, { subareas });
};

export const deleteProjeto = async (areaId, subareaId, projetoId) => {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    const areaData = areaSnapshot.data();
    const subareas = areaData.subareas.map(sa =>
        sa.id === subareaId ? {
            ...sa,
            projetos: sa.projetos.filter(p => p.id !== projetoId)
        } : sa
    );
    await updateDoc(areaRef, { subareas });
};