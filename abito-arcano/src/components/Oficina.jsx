import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPontuacoes } from '../auth/firebasePontuacoes';
import { getListaAtividades, updatePontuacao } from '../auth/firebaseAtividades';
import { getAreas } from '../auth/firebaseAreaSubarea';
import { getHoraTrocaFirebase } from '../auth/firebaseDiasHoras';
import { getListaTarefas } from '../auth/firebaseTarefas';
import { getDias } from '../auth/firebaseDiasHoras';

function Oficina({ user }) {
    const navigate = useNavigate();
    const [tarefas, setTarefas] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [pontuacoes, setPontuacoes] = useState({});
    const [areas, setAreas] = useState([]);
    const [subareas, setSubareas] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [horaTroca, setHoraTroca] = useState([]);
    const [dias, setDias] = useState([]);
    const [view, setView] = useState('areas');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            const tarefas = await getListaTarefas(user.uid);
            const atividades = await getListaAtividades(user.uid);
            const pontuacoes = await getPontuacoes(user.uid);
            const areas = await getAreas();
            const horaTroca = await getHoraTrocaFirebase();
            const dias = await getDias(user.uid);

            console.log("pontuacoes")
            console.log(pontuacoes)

            const subareas = areas.flatMap(area => area.subareas || []);
            //const projetos = areas.flatMap(area => area.projetos || []);

            setTarefas(tarefas);
            setAtividades(atividades);
            setPontuacoes(pontuacoes);
            setAreas(areas);
            setSubareas(subareas);
            //setProjetos(projetos);
            setHoraTroca(horaTroca);
            setDias(dias)
        };
        fetchData();
    }, [user, navigate]);

    const formatItem = (item, type) => {
        if (typeof item !== 'object' || item === null) {
            return item;
        }
    
        const orderedItem = {};
    
        if (type === 'pontuacao') {
            // Ordena 'data' primeiro
            if (item.data) {
                orderedItem.data = item.data;
            }
    
            // Em seguida, ordena 'areas'
            if (item.areas) {
                orderedItem.areas = item.areas.map(area => {
                    const orderedArea = {
                        areaId: area.areaId,
                        pontos: area.pontos,
                        subareas: area.subareas.map(subarea => ({
                            subareaId: subarea.subareaId,
                            pontos: subarea.pontos
                        }))
                    };
                    return orderedArea;
                });
            }
    
            // Finalmente, adiciona outras propriedades, exceto 'data' e 'areas'
            Object.keys(item)
                .filter(key => key !== 'data' && key !== 'areas')
                .sort()
                .forEach(key => {
                    if (Array.isArray(item[key])) {
                        orderedItem[key] = item[key]
                            .map(subItem => formatItem(subItem, type))
                            .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
                    } else {
                        orderedItem[key] = item[key];
                    }
                });
        } else {
            // Ordenação padrão para outros itens
            if (item.id) {
                orderedItem.id = item.id;
            }
    
            Object.keys(item)
                .filter(key => key !== 'id')
                .sort()
                .forEach(key => {
                    if (Array.isArray(item[key])) {
                        orderedItem[key] = item[key]
                            .map(subItem => formatItem(subItem, type))
                            .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
                    } else {
                        orderedItem[key] = item[key];
                    }
                });
        }
    
        return orderedItem;
    };
    
    const formatData = (data, type) => {
        if (Array.isArray(data)) {
            return (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <pre>{JSON.stringify(formatItem(item, type), null, 2)}</pre>
                        </li>
                    ))}
                </ul>
            );
        }
        return (
            <pre>{JSON.stringify(formatItem(data, type), null, 2)}</pre>
        );
    };
    

    const renderView = () => {
        switch (view) {
            case 'areas':
                return formatData(areas, 'area');
            case 'subareas':
                return formatData(subareas, 'subarea');
            case 'projetos':
                return formatData(projetos, 'projeto');
            case 'pontuacoes':
                return formatData(pontuacoes, 'pontuacao');
            case 'tarefas':
                return formatData(tarefas, 'tarefa');
            case 'atividades':
                return formatData(atividades, 'atividade');
            case 'dias':
                return formatData(dias, 'dia');
            case 'horaTroca':
                return formatData(horaTroca, 'horaTroca');
            default:
                return <div>Selecione uma visualização</div>;
        }
    };
    

    return (
        <div>
            <h1>Oficina</h1>
            <div>
                <button onClick={() => setView('areas')}>Áreas</button>
                <button onClick={() => setView('subareas')}>Subáreas</button>
                <button onClick={() => setView('projetos')}>Projetos</button>
                <button onClick={() => setView('pontuacoes')}>Pontuações</button>
                <button onClick={() => setView('tarefas')}>Tarefas</button>
                <button onClick={() => setView('atividades')}>Atividades</button>
                <button onClick={() => setView('dias')}>Dias</button>
                <button onClick={() => setView('horaTroca')}>Hora de Troca</button>
            </div>
            {renderView()}
        </div>
    );
}

export default Oficina;
