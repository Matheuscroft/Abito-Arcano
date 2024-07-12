import React, { useState, useEffect } from 'react';
import { getAreas } from '../auth/firebaseService';

function EditorItem({ item, onSave, tipo, setItemEditando }) {
  const [nome, setNome] = useState(item.nome);
  const [numero, setNumero] = useState(item.numero);
  const [area, setArea] = useState(item.area);
  const [subarea, setSubarea] = useState(item.subarea);
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
    setItemEditando(false)
    onSave(nome, numero, area, subarea);
  };

  return (
    <div>
      <h2>Editar {tipo === 'tarefa' ? 'Tarefa' : 'Atividade'}</h2>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder={`Digite o nome da ${tipo}`}
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

export default EditorItem;
