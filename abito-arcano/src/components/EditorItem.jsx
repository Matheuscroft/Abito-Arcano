import React, { useState, useEffect } from 'react';

function EditorItem({ item, onSave, tipo, setItemEditando, areas }) {
  const [nome, setNome] = useState(item.nome);
  const [numero, setNumero] = useState(item.numero);
  const [area, setArea] = useState(item.area);
  const [subarea, setSubarea] = useState(item.subarea);
  //const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [diasSemana, setDiasSemana] = useState(item.diasSemana || []);
  

  const diasOpcoes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];



  useEffect(() => {
    if (area) {
      const areaEncontrada = areas.find(a => a.nome === area);
      setSubareas(areaEncontrada ? areaEncontrada.subareas : []);
    }
  }, [area, areas]);

  useEffect(() => {
    console.log("item.diasSemana")
    console.log(item.diasSemana)
  }, []);

  const handleSave = () => {

    const areaNome = area === "" ? "SEM CATEGORIA" : area;
    const areaEncontrada = areas.find(a => a.nome === areaNome);

    const subareaEncontrada = areaEncontrada?.subareas.find(s => s.nome === subarea);

    let nomeSubarea = subareaEncontrada ? subareaEncontrada.nome : ""

   
    const areaId = areaEncontrada ? areaEncontrada.id : null;
    const subareaId = subareaEncontrada ? subareaEncontrada.id : null;

    setItemEditando(false);
    if (tipo === 'tarefa') {
      onSave(nome, numero, areaNome, nomeSubarea, areaId, subareaId, diasSemana);
    } else {
      onSave(nome, numero, areaNome, nomeSubarea, areaId, subareaId);
    }
  };

  const handleDiaSemanaChange = (dia) => {
    setDiasSemana(prevDias =>
      prevDias.includes(dia)
        ? prevDias.filter(d => d !== dia) 
        : [...prevDias, dia] 
    );
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

      {tipo === 'tarefa' && (
        <div>
          <h4>Selecione os dias da semana:</h4>
          {diasOpcoes.map((dia, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={diasSemana.includes(dia)}
                onChange={() => handleDiaSemanaChange(dia)}
              />
              {dia}
            </label>
          ))}
        </div>
      )}

      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}

export default EditorItem;
