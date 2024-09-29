import React, { useState, useEffect } from 'react';
import Atividade from './Atividade';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem, buscarIdsAreaESubarea } from './todoUtils';
import { getListaAtividades, setListaAtividades } from '../auth/firebaseAtividades.js';

function ListaAtividades({ user, atividades = [], setAtividades, setPontuacoes, dias, setDias, areas, resetarListaAtividades, dataAtual }) {
  const [nomeNovaAtividade, setNomeNovaAtividade] = useState('');
  const [itemEditando, setItemEditando] = useState(null);

  const reformarAtividades = async (userId, areas) => {
    try {
      const atividades = await getListaAtividades(userId);

      const atividadesReformadas = atividades.map(atividade => {
        const { areaId, subareaId } = buscarIdsAreaESubarea(areas, atividade.area, atividade.subarea);

        return {
          id: atividade.id,
          area: atividade.area,
          areaId: areaId,
          finalizada: atividade.finalizada,
          nome: atividade.nome,
          numero: atividade.numero,
          subarea: atividade.subarea,
          subareaId: subareaId,
          userId: atividade.userId
        };
      });

      console.log("atividadesReformadas")
      console.log(atividadesReformadas)

      await setListaAtividades(userId, atividadesReformadas);
      console.log("Atividades reformadas e salvas com sucesso.");
    } catch (error) {
      console.error("Erro ao reformar as atividades:", error);
    }
  };

  /*useEffect(() => {
    console.log("Estado no ListaAtividades - atividades:");
    console.log(atividades)

    console.log("atividades.atividades:");
    console.log(atividades.atividades)
  }, [atividades]);*/

  if (!Array.isArray(atividades.atividades)) {
    atividades.atividades = [];
  }

  const handleAdicionarItem = async () => {

    if (nomeNovaAtividade.trim() === '') return;

    addItem(nomeNovaAtividade, 'atividade', setAtividades, atividades.atividades, user.uid, areas)

    setNomeNovaAtividade('');
};

  return (
    <div>
      <h1>Atividades</h1>
      <input
        type="text"
        value={nomeNovaAtividade}
        onChange={(e) => setNomeNovaAtividade(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAdicionarItem();
          }
        }}
        placeholder="Digite o nome da atividade"
      />
      <button onClick={handleAdicionarItem}>Adicionar Atividade</button>
      <button onClick={() => reformarAtividades(user.uid, areas)}>Reformar Lista de Atividades</button>
      <button onClick={() => resetarListaAtividades()}>Resetar Lista de Atividades</button>
      <ul>
        {atividades.filter(atividade => !atividade.finalizada).map((atividade) => (
          <li key={atividade.id}>
            <Atividade
              atividade={atividade}
              onEdit={() => setItemEditando(atividade)}
              onDelete={() => deleteItem(atividade.id, 'atividade', setAtividades, atividades, user.uid)}
              onToggle={() => toggleFinalizada(atividade.id, 'atividade', atividades, setAtividades, setPontuacoes, user.uid, dataAtual)}
              areas={areas}
            />
          </li>
        ))}
      </ul>
      {itemEditando && (
        <EditorItem
          item={itemEditando}
          tipo={"atividade"}
          setItemEditando={setItemEditando}
          onSave={(nome, numero, area, subarea, areaId, subareaId) => updateItem(itemEditando.id, nome, numero, area, subarea, areaId, subareaId, 'atividade', setAtividades, atividades, user.uid)}
          areas={areas}
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {atividades.filter(atividade => atividade.finalizada).map((atividade) => (
          <li key={atividade.id} style={{ textDecoration: 'line-through' }}>
            <Atividade
              atividade={atividade}
              onEdit={() => setItemEditando(atividade)}
              onDelete={() => deleteItem(atividade.id, 'atividade', setAtividades, atividades, user.uid)}
              onToggle={() => toggleFinalizada(atividade.id, 'atividade', atividades, setAtividades, setPontuacoes, user.uid, dataAtual)}
              areas={areas}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaAtividades;
