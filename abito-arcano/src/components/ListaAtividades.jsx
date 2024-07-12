import React, { useState, useEffect } from 'react';
import Atividade from './Atividade';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem } from './todoUtils';
import {
  getListaAtividades,
  getAreas
} from '../auth/firebaseService';

function ListaAtividades() {
  const [atividades, setAtividades] = useState([]);
  const [novaAtividade, setNovaAtividade] = useState('');
  const [itemEditando, setItemEditando] = useState(null);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [editorVisivel, setEditorVisivel] = useState(false); // Novo estado para controlar a visibilidade do editor

  useEffect(() => {
    const fetchData = async () => {
      const atividades = await getListaAtividades();
      const areas = await getAreas();

      const areasComSubareas = areas.map(area => ({
        ...area,
        subareas: area.subareas || []
      }));

      setAtividades(atividades);
    };

    fetchData();
  }, []);

  const handleEdit = (atividade) => {
    setItemEditando(atividade);
    setTipoEditando('atividade');
    setEditorVisivel(true); // Mostra o editor quando iniciar a edição
  };

  const handleSave = (nome, numero, area, subarea) => {
    updateItem(itemEditando.id, nome, numero, area, subarea, 'atividade', setAtividades, setAtividades, [], atividades);
    setItemEditando(null); // Esconde o editor após salvar
    setTipoEditando(null);
    setEditorVisivel(false);
  };

  return (
    <div>
      <h1>Atividades</h1>
      <input
        type="text"
        value={novaAtividade}
        onChange={(e) => setNovaAtividade(e.target.value)}
        placeholder="Digite o nome da atividade"
      />
      <button onClick={() => addItem(novaAtividade, 'atividade', setAtividades, setAtividades, [], atividades)}>Adicionar Atividade</button>

      <ul>
        {atividades.filter(atividade => !atividade.finalizada).map((atividade) => (
          <li key={atividade.id}>
            <Atividade
              atividade={atividade}
              onEdit={() => handleEdit(atividade)}
              onDelete={() => deleteItem(atividade.id, 'atividade', setAtividades, setAtividades, [], atividades)}
              onToggle={() => toggleFinalizada(atividade.id, 'atividade', setAtividades, setAtividades, [], atividades, () => {})}
            />
          </li>
        ))}
      </ul>
      {itemEditando && tipoEditando === 'atividade' && editorVisivel && (
        <EditorItem
          item={itemEditando}
          onSave={handleSave}
          tipo="atividade"
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {atividades.filter(atividade => atividade.finalizada).map((atividade) => (
          <li key={atividade.id} style={{ textDecoration: 'line-through' }}>
            <Atividade
              atividade={atividade}
              onEdit={() => handleEdit(atividade)}
              onDelete={() => deleteItem(atividade.id, 'atividade', setAtividades, setAtividades, [], atividades)}
              onToggle={() => toggleFinalizada(atividade.id, 'atividade', setAtividades, setAtividades, [], atividades, () => {})}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaAtividades;
