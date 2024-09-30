import React, { useState, useEffect } from 'react';
import Subareas from './Subareas';
import {
    getAreas,
    updateAreas,
    updateArea,
    deleteArea
} from '../auth/firebaseAreaSubarea';
import { v4 as uuidv4 } from 'uuid';
import InputAdicionarNome from './componentes/inputs/InputAdicionarNome/InputAdicionarNome';

function Areas({user}) {
    const [areas, setAreas] = useState([]);
    const [nomeArea, setNomeArea] = useState('');
    const [corArea, setCorArea] = useState('#ffffff');
    const [entrarSubArea, setEntrarSubArea] = useState(false);
    const [areaSelecionada, setAreaSelecionada] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [novoNomeArea, setNovoNomeArea] = useState('');
    const [novaCorArea, setNovaCorArea] = useState('#ffffff');
    const [todasAreas, setTodasAreas] = useState([]);



    useEffect(() => {
        const fetchAreas = async () => {
            if (user.uid) { 
                try {
                    const fetchedAreas = await getAreas(user.uid);  
                    console.log("fetchedAreas:", fetchedAreas);
                    setTodasAreas(fetchedAreas.areas);

                    const areasFiltradas = fetchedAreas.areas.filter(area => area.nome !== 'SEM CATEGORIA');
                    setAreas(areasFiltradas);

                    console.log("areasFiltradas:", areasFiltradas);

                } catch (error) {
                    console.error("Erro ao buscar áreas:", error);
                }
            }
        };
        fetchAreas();
    }, [user]);


    const adicionarArea = async () => {
        console.log("entrei adicionarArea")
        if (nomeArea.trim() === '') return;
        const novaArea = { id: uuidv4(), nome: nomeArea.toUpperCase(), cor: corArea, subareas: [] };
        
        const novasAreas = [...todasAreas, novaArea];
    
        await updateAreas(user.uid, novasAreas);

        console.log("novasAreas")
        console.log(novasAreas)

    
        setTodasAreas(novasAreas);
        setAreas(novasAreas.filter(area => area.nome !== 'SEM CATEGORIA'));

        setNomeArea('');
        setCorArea('#ffffff');
    };

    const atualizarAreaComSubarea = async (areaAtualizada) => {
        const novasAreas = todasAreas.map((a) =>
            a.id === areaAtualizada.id ? areaAtualizada : a
        );
        
        await updateAreas(user.uid, novasAreas);

        setTodasAreas(novasAreas);
        setAreas(novasAreas.filter(area => area.nome !== 'SEM CATEGORIA'));
    };
    

    const abrirModalEdicao = (index) => {
        console.log(" abrirModalEdicao index")
        console.log(index)
        setAreaSelecionada(index);
        setNovoNomeArea(areas[index].nome);
        setNovaCorArea(areas[index].cor);
        setModalAberto(true);
    };

    const fecharModalEdicao = () => {
        setAreaSelecionada(null);
        setModalAberto(false);
    };

    /*const editarArea = async () => {
        const areaAtualizada = { ...areas[areaSelecionada], nome: novoNomeArea.toUpperCase(), cor: novaCorArea };
        await updateArea(areaAtualizada.id, areaAtualizada);
        const areasAtualizadas = areas.map((area, index) =>
            index === areaSelecionada ? areaAtualizada : area
        );
        setAreas(areasAtualizadas);
        fecharModalEdicao();
    };*/

    const editarArea = async () => {
        const areaAtualizada = { 
            ...areas[areaSelecionada], 
            nome: novoNomeArea.toUpperCase(), 
            cor: novaCorArea 
        };

        const areasAtualizadas = todasAreas.map((area) =>
            area.id === areaAtualizada.id ? areaAtualizada : area
        );
        
        await updateAreas(user.uid, areasAtualizadas);
    
        setTodasAreas(areasAtualizadas);
        setAreas(areasAtualizadas.filter(area => area.nome !== 'SEM CATEGORIA'));
        
        fecharModalEdicao();
    };
    

    /*const excluirArea = async (index) => {
        await deleteArea(areas[index].id);
        const areasAtualizadas = areas.filter((_, i) => i !== index);
        setAreas(areasAtualizadas);
    };*/

    const excluirArea = async (id) => {
        const areasAtualizadas = todasAreas.filter(area => area.id !== id);
        
        await updateAreas(user.uid, areasAtualizadas);
    
        setTodasAreas(areasAtualizadas);
        setAreas(areasAtualizadas.filter(area => area.nome !== 'SEM CATEGORIA'));
    };
    
    

    const abrirSubareas = (index) => {
        const elementClicked = document.activeElement.tagName.toLowerCase();
        if (elementClicked === "button") {
            return;
        }
        setAreaSelecionada(index);
        setEntrarSubArea(true);
    };

    if (entrarSubArea !== false) {
        return <Subareas
            area={areas[areaSelecionada]}
            voltar={() => setEntrarSubArea(false)}
            /*atualizarArea={(areaAtualizada) => {
                const novasAreas = areas.map(a => a.id === areaAtualizada.id ? areaAtualizada : a);
                setAreas(novasAreas);
            }}*/
                atualizarAreaComSubarea={atualizarAreaComSubarea}
        />;
    }

    return (
        <div>
            <h1>Áreas</h1>
            <InputAdicionarNome placeholder="Digite o nome da área" nomeNovo={nomeArea.toUpperCase()} setNomeNovo={setNomeArea} handleAddItem={adicionarArea} />
            
            <input
                type="color"
                value={corArea}
                onChange={(e) => setCorArea(e.target.value)}
            />
            <button onClick={adicionarArea}>Adicionar Área</button>
            <div className="lista-areas">
                {areas.map((area, index) => (
                    <div className="cartao-area-principal" key={index}>
                        <div
                            className="cartao-area"
                            style={{ backgroundColor: area.cor }}
                            onClick={() => abrirSubareas(index)}
                        >
                            <div className="nome-area">{area.nome}</div>
                        </div>
                        <div>
                            <button onClick={() => excluirArea(area.id)}>Excluir</button>
                            <button onClick={() => abrirModalEdicao(index)}>Editar</button>
                        </div>
                    </div>
                ))}
            </div>
            {modalAberto && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Área</h2>
                        <input
                            type="text"
                            value={novoNomeArea}
                            onChange={(e) => setNovoNomeArea(e.target.value.toUpperCase())}
                            placeholder="Digite o novo nome da área"
                        />
                        <input
                            type="color"
                            value={novaCorArea}
                            onChange={(e) => setNovaCorArea(e.target.value)}
                        />
                        <button onClick={editarArea}>Salvar</button>
                        <button onClick={fecharModalEdicao}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Areas;
