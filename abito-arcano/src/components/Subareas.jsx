import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  addSubarea,
  updateSubarea,
  deleteSubarea,
  addProjeto,
  updateProjeto,
  deleteProjeto
} from '../auth/firebaseService';

function Subareas({ area, voltar, atualizarArea }) {
  const [subareas, setSubareas] = useState([]);
  const [subareaSelecionada, setSubareaSelecionada] = useState(null);
  const [novoProjeto, setNovoProjeto] = useState('');
  const [novoNomeSubarea, setNovoNomeSubarea] = useState('');

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
  };

  const editarSubarea = async (index, novoNome) => {
    const subareaAtualizada = { ...subareas[index], nome: novoNome };
    await updateSubarea(area.id, subareas[index].id, subareaAtualizada);
    const subareasAtualizadas = subareas.map((subarea, i) =>
      i === index ? subareaAtualizada : subarea
    );
    atualizarSubareas(subareasAtualizadas);
    setSubareaSelecionada(null); // Fechar o campo de edição após salvar
  };

  const excluirSubarea = async (index) => {
    await deleteSubarea(area.id, subareas[index].id);
    const subareasAtualizadas = subareas.filter((_, i) => i !== index);
    atualizarSubareas(subareasAtualizadas);
  };

  const abrirSubarea = (index) => {
    setSubareaSelecionada(index);
  };

  const fecharSubarea = () => {
    setSubareaSelecionada(null);
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
    await deleteProjeto(area.id, subareas[subareaIndex].id, subareas[subareaIndex].projetos[projetoIndex].id);
    const subareasAtualizadas = subareas.map((subarea, index) =>
      index === subareaIndex ? { ...subarea, projetos: subarea.projetos.filter((_, i) => i !== projetoIndex) } : subarea
    );
    atualizarSubareas(subareasAtualizadas);
  };

  const editarProjeto = async (subareaIndex, projetoIndex, novoNome) => {
    const projetoAtualizado = { ...subareas[subareaIndex].projetos[projetoIndex], nome: novoNome };
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
              <button onClick={() => editarSubarea(index)}>Editar</button>
              <button onClick={() => excluirSubarea(index)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subareas;
