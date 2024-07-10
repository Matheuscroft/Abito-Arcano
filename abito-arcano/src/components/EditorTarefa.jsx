import React, { useState, useEffect } from 'react';
import { getAreas } from '../auth/firebaseService';

function EditorTarefa({ tarefa, onSave }) {
  const [nome, setNome] = useState(tarefa.nome);
  const [numero, setNumero] = useState(tarefa.numero);
  const [area, setArea] = useState(tarefa.area);
  const [subarea, setSubarea] = useState(tarefa.subarea);
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      const fetchedAreas = await getAreas();
      setAreas(fetchedAreas);
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    if (area) {
      const areaEncontrada = areas.find(a => a.nome === area);
      setSubareas(areaEncontrada ? areaEncontrada.subareas : []);
    }
  }, [area, areas]);

  const handleSave = () => {
    onSave(nome, numero, area, subarea);
  };

  return (
    <div>
      <h2>Editar Tarefa</h2>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Digite o nome da tarefa"
      />
      <input
        type="number"
        value={numero}
        onChange={(e) => setNumero(Number(e.target.value))}
        placeholder="Digite um número"
      />
      <select value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="">Selecione uma área</option>
        {areas.map((a, index) => (
          <option key={index} value={a.nome} style={{ backgroundColor: a.cor }}>{a.nome}</option>
        ))}
      </select>
      <select value={subarea} onChange={(e) => setSubarea(e.target.value)}>
        <option value="">Selecione uma subárea</option>
        {subareas.map((s, index) => (
          <option key={index} value={s.nome}>{s.nome}</option>
        ))}
      </select>
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}

export default EditorTarefa;
