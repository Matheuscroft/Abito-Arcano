import { db } from './firebase.mjs';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc
} from 'firebase/firestore';

export const getAreas = async () => {
    const querySnapshot = await getDocs(collection(db, "areas"));
    const areas = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return areas;
};

export const getCorArea = async (nomeArea) => {
    try {
      const areas = await getAreas();
      const areaEncontrada = areas.find(a => a.nome === nomeArea);
      return areaEncontrada ? areaEncontrada.cor : '#000'; 
    } catch (error) {
      console.error('Erro ao buscar cor da área:', error);
      return '#000'; 
    }
  };


export const addArea = async (area) => {
    const docRef = await addDoc(collection(db, "areas"), area);
    return { ...area, id: docRef.id };
};

export const updateArea = async (id, area) => {
    const docRef = doc(db, "areas", id);
    await updateDoc(docRef, area);
};

export const deleteArea = async (id) => {
    const docRef = doc(db, "areas", id);
    await deleteDoc(docRef);
};

export const addSubarea = async (areaId, subarea) => {
  try {
    const areaRef = doc(db, "areas", areaId);
    const areaSnapshot = await getDoc(areaRef);
    
    if (!areaSnapshot.exists()) {
      throw new Error(`Document with ID ${areaId} does not exist.`);
    }

    const subareaDocRef = await addDoc(collection(areaRef, "subareas"), subarea);
    const subareaId = subareaDocRef.id;

    const updatedArea = {
      ...areaSnapshot.data(),
      subareas: [...(areaSnapshot.data().subareas || []), { id: subareaId, ...subarea }]
    };
    await updateDoc(areaRef, updatedArea);

    return { id: subareaId, ...subarea }; 
  } catch (error) {
    console.error("Erro ao adicionar subárea:", error);
    throw error;
  }
};

  
export const updateSubarea = async (areaId, subareaId, subarea) => {
    try {
      const areaRef = doc(db, "areas", areaId);
      const areaSnapshot = await getDoc(areaRef);
      
      if (!areaSnapshot.exists()) {
        throw new Error(`Document with ID ${areaId} does not exist.`);
      }
  
      const subareaRef = doc(collection(areaRef, "subareas"), subareaId);
      await updateDoc(subareaRef, subarea);
  
      // Atualiza a área para refletir a subárea atualizada
      const updatedSubareas = areaSnapshot.data().subareas.map(sa =>
        sa.id === subareaId ? { ...sa, ...subarea } : sa
      );
      const updatedArea = { ...areaSnapshot.data(), subareas: updatedSubareas };
      await updateDoc(areaRef, updatedArea);
  
      return { id: subareaId, ...subarea }; // Retorna o objeto atualizado
    } catch (error) {
      console.error("Erro ao atualizar subárea:", error);
      throw error;
    }
  };
  
  
  export const deleteSubarea = async (areaId, subareaId) => {
    try {
      const areaRef = doc(db, "areas", areaId);
      const areaSnapshot = await getDoc(areaRef);
      
      if (!areaSnapshot.exists()) {
        throw new Error(`Document with ID ${areaId} does not exist.`);
      }
  
      const subareaRef = doc(collection(areaRef, "subareas"), subareaId);
      await deleteDoc(subareaRef);
  
      // Remove a subárea da lista de subáreas da área
      const updatedSubareas = areaSnapshot.data().subareas.filter(sa => sa.id !== subareaId);
      const updatedArea = { ...areaSnapshot.data(), subareas: updatedSubareas };
      await updateDoc(areaRef, updatedArea);
  
      return subareaId;
    } catch (error) {
      console.error("Erro ao excluir subárea:", error);
      throw error;
    }
  };