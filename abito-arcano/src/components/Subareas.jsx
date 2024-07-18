import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  
  addProjeto,
  updateProjeto,
  deleteProjeto
} from '../auth/firebaseProjetos';
import { addSubarea,
  updateSubarea,
  deleteSubarea } from '../auth/firebaseAreaSubarea';

function Subareas({ area, voltar, atualizarArea }) {
  const [subareas, setSubareas] = useState([]);
  const [subareaSelecionada, setSubareaSelecionada] = useState(null);
  const [novoProjeto, setNovoProjeto] = useState('');
  const [novoNomeSubarea, setNovoNomeSubarea] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    setSubareas(area.subareas || []);
  }, [area]);

  const adicionarSubarea = async (nomeSubarea) => {
    if (nomeSubarea.trim() === '') return;
    const novaSubarea = { nome: nomeSubarea };
    const subareaAdicionada = await addSubarea(area.id, novaSubarea);
    const novasSubareas = [...subareas, subareaAdicionada];
    atualizarSubareas(novasSubareas);
  };

  const atualizarSubareas = (novasSubareas) => {
    const areaAtualizada = { ...area, subareas: novasSubareas };
    atualizarArea(areaAtualizada);
    setSubareas(novasSubareas);
  };

  const abrirModalEdicao = (index) => {
    setSubareaSelecionada(index);
    setNovoNomeSubarea(subareas[index].nome);
    setModalAberto(true);
  };

  const fecharModalEdicao = () => {
    setSubareaSelecionada(null);
    setModalAberto(false);
  };

  const editarSubarea = async () => {
    const subareaAtualizada = { ...subareas[subareaSelecionada], nome: novoNomeSubarea };
    await updateSubarea(area.id, subareas[subareaSelecionada].id, subareaAtualizada);
    const subareasAtualizadas = subareas.map((subarea, index) =>
      index === subareaSelecionada ? subareaAtualizada : subarea
    );
    atualizarSubareas(subareasAtualizadas);
    fecharModalEdicao();
  };

  const excluirSubarea = async (index) => {
    await deleteSubarea(area.id, subareas[index].id);
    const subareasAtualizadas = subareas.filter((_, i) => i !== index);
    atualizarSubareas(subareasAtualizadas);
  };

  const abrirSubarea = (index) => {
    setSubareaSelecionada(index);
  };

  const adicionarProjeto = async () => {
    if (novoProjeto.trim() === '') return;
    const novoProjetoObj = { nome: novoProjeto };
    const projetoAdicionado = await addProjeto(area.id, subareas[subareaSelecionada].id, novoProjetoObj);
    const subareasAtualizadas = subareas.map((subarea, index) =>
      index === subareaSelecionada ? { ...subarea, projetos: [...(subarea.projetos || []), projetoAdicionado] } : subarea
    );
    atualizarSubareas(subareasAtualizadas);
    setNovoProjeto('');
  };

  const excluirProjeto = async (subareaIndex, projetoIndex) => {
    try {
      await deleteProjeto(area.id, subareas[subareaIndex].id, subareas[subareaIndex].projetos[projetoIndex].id);
      const subareasAtualizadas = subareas.map((subarea, index) =>
        index === subareaIndex ? { ...subarea, projetos: subarea.projetos.filter((_, i) => i !== projetoIndex) } : subarea
      );
      atualizarSubareas(subareasAtualizadas);
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
    }
  };

  const editarProjeto = async (subareaIndex, projetoIndex, novoNome) => {
    const projetoAtualizado = { ...subareas[subareaIndex].projetos[projetoIndex], nome: novoNome };
    try {
      await updateProjeto(area.id, subareas[subareaIndex].id, projetoAtualizado.id, projetoAtualizado);
      const subareasAtualizadas = subareas.map((subarea, index) =>
        index === subareaIndex ? {
          ...subarea,
          projetos: subarea.projetos.map((projeto, idx) =>
            idx === projetoIndex ? projetoAtualizado : projeto
          )
        } : subarea
      );
      atualizarSubareas(subareasAtualizadas);
    } catch (error) {
      console.error("Erro ao editar projeto:", error);
    }
  };

  return (
    <div>
      <h1>Subáreas de {area.nome}</h1>
      <input
        type="text"
        placeholder="Digite o nome da subárea"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            adicionarSubarea(e.target.value);
            e.target.value = '';
          }
        }}
      />
      <button onClick={voltar}>Voltar</button>
      <div className="lista-subareas">
        {subareas.map((subarea, index) => (
          <div key={index} className="cartao-subarea-principal">
            <div
              className="cartao-subarea"
              style={{ backgroundColor: area.cor }}
              onClick={() => abrirSubarea(index)}
            >
              <div className="nome-subarea">{subarea.nome}</div>
            </div>
            {subareaSelecionada === index && (
              <div>
                <div>
                  <input
                    type="text"
                    value={novoProjeto}
                    onChange={(e) => setNovoProjeto(e.target.value)}
                    placeholder="Novo projeto"
                  />
                  <button onClick={adicionarProjeto}>Adicionar Projeto</button>
                </div>
                {subarea.projetos && subarea.projetos.map((projeto, projIndex) => (
                  <div key={projIndex} className="projeto">
                    <Link to={`/projeto/${projeto.nome}`} className="link-projeto">
                      <div
                        className="pentagono"
                        style={{ backgroundColor: area.cor }}
                      />
                      <div className="nome-projeto">{projeto.nome}</div>
                    </Link>
                    <div>
                      <button onClick={() => editarProjeto(index, projIndex, prompt("Editar nome do projeto:", projeto.nome) || projeto.nome)}>Editar</button>
                      <button onClick={() => excluirProjeto(index, projIndex)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <button onClick={() => abrirModalEdicao(index)}>Editar</button>
              <button onClick={() => excluirSubarea(index)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
      {modalAberto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Subárea</h2>
            <input
              type="text"
              value={novoNomeSubarea}
              onChange={(e) => setNovoNomeSubarea(e.target.value)}
              placeholder="Digite o novo nome da subárea"
            />
            <button onClick={editarSubarea}>Salvar</button>
            <button onClick={fecharModalEdicao}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subareas;
