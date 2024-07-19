import React, { useState } from 'react';
import Atividade from './Atividade';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem } from './todoUtils';

function ListaAtividades({ user, atividades, setAtividades, setPontuacoes }) {
  const [novaAtividade, setNovaAtividade] = useState('');
  const [itemEditando, setItemEditando] = useState(null);

  return (
    <div>
      <h1>Atividades</h1>
      <input
        type="text"
        value={novaAtividade}
        onChange={(e) => setNovaAtividade(e.target.value)}
        placeholder="Digite o nome da atividade"
      />
      <button onClick={() => addItem(novaAtividade, 'atividade', setAtividades, atividades)}>Adicionar Atividade</button>
      <ul>
        {atividades.filter(atividade => !atividade.finalizada).map((atividade) => (
          <li key={atividade.id}>
            <Atividade
              atividade={atividade}
              onEdit={() => setItemEditando(atividade)}
              onDelete={() => deleteItem(atividade.id, 'atividade', setAtividades, atividades)}
              onToggle={() => toggleFinalizada(atividade.id, 'atividade', atividades, setAtividades, setPontuacoes)}
            />
          </li>
        ))}
      </ul>
      {itemEditando && (
        <EditorItem
          item={itemEditando}
          setItemEditando={setItemEditando}
          onSave={(nome, numero, area, subarea) => updateItem(itemEditando.id, nome, numero, area, subarea, 'atividade', setAtividades, atividades)}
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {atividades.filter(atividade => atividade.finalizada).map((atividade) => (
          <li key={atividade.id} style={{ textDecoration: 'line-through' }}>
            <Atividade
              atividade={atividade}
              onEdit={() => setItemEditando(atividade)}
              onDelete={() => deleteItem(atividade.id, 'atividade', setAtividades, atividades)}
              onToggle={() => toggleFinalizada(atividade.id, 'atividade', atividades, setAtividades, setPontuacoes)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaAtividades;
