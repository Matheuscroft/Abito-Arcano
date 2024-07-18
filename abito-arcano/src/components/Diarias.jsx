import React, { useState, useEffect, useRef } from 'react';
import ListaTarefas from './ListaTarefas';

import { getListaTarefas, addOrUpdateTarefasPorDia, getDias, setHoraTrocaFirebase, getHoraTrocaFirebase, inserirDias } from '../auth/firebaseService';
import RelogioCron from './RelogioCron';
import BarraDias from './BarraDias';

const Diarias = ({ setPontuacoes }) => {
    const [tarefasPorDia, setTarefasPorDia] = useState({});
    const [dataAtual, setDataAtual] = useState('');
    const [tarefasGerais, setTarefasGerais] = useState([]);
    const [diaVisualizado, setDiaVisualizado] = useState('');
    const [dias, setDias] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            //resetarListaDeDias()
            const diasSalvos = await getDias();

            const tarefasGerais = await getListaTarefas();
            setTarefasGerais(tarefasGerais);

            const tarefasPorDiaTemp = {};

            console.log("diasSalvos")
            console.log(diasSalvos)

            const hoje = new Date().toLocaleDateString('pt-BR');
            const diaAtual = diasSalvos.find(dia => dia.dataAtual).data || { data: hoje };

            if (diasSalvos.length === 0) {

                resetarListaDeDias()

            } else {

                for (const dia of diasSalvos) {
                    tarefasPorDiaTemp[dia.data] = dia.tarefas.length === 0
                        ? tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
                        : dia.tarefas;
                }

                setDataAtual(diaAtual);
                setDias(diasSalvos);
            }

            setTarefasPorDia(tarefasPorDiaTemp);
            setDiaVisualizado(diaAtual);
        };

        fetchData();
    }, []);

    
    const resetarListaDeDias = async () => {
        try {
            const novosDias = [];
            for (let i = 0; i <= 6; i++) {
                const data = new Date();
                data.setDate(data.getDate() + i);
                const dataStr = data.toLocaleDateString('pt-BR');
                const dia = {
                    data: dataStr,
                    dataAtual: i === 0,
                    tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
                };
                novosDias.push(dia);
                setTarefasPorDia(prev => ({ ...prev, [dataStr]: dia.tarefas }));
            }
            await inserirDias(novosDias);
            setDias(novosDias);
            setDataAtual(novosDias[0].data);
        } catch (error) {
            console.error("Erro ao resetar a lista de dias:", error);
        }
    };


    const converterParaDate = (dataStr) => {
        const [dia, mes, ano] = dataStr.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
    };


    const trocarDia = async () => {
        try {
            console.log("Trocar dia");

            const dataAtualDate = converterParaDate(dataAtual);
            dataAtualDate.setDate(dataAtualDate.getDate() + 1);
            const novaDataStr = dataAtualDate.toLocaleDateString('pt-BR');

            let diasSalvos = await getDias();
            console.log("diasSalvos após troca", diasSalvos);

            diasSalvos = diasSalvos.map(dia => {
                if (dia.data === dataAtual) {
                    return { ...dia, dataAtual: false };
                } else if (dia.data === novaDataStr) {
                    return { ...dia, dataAtual: true };
                }
                return dia;
            });

            const ultimoDia = diasSalvos[diasSalvos.length - 1];
            const ultimoDiaDate = converterParaDate(ultimoDia.data);
            ultimoDiaDate.setDate(ultimoDiaDate.getDate() + 1);
            const novoDiaStr = ultimoDiaDate.toLocaleDateString('pt-BR');

            const novoDia = {
                data: novoDiaStr,
                dataAtual: false,
                tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
            };

            diasSalvos.push(novoDia);

            await inserirDias(diasSalvos);

            setDataAtual(novaDataStr);
            setDiaVisualizado(novaDataStr);

            console.log("Dia trocado com sucesso");
        } catch (error) {
            console.error("Erro ao trocar dia:", error);
        }
    };



    useEffect(() => {
        console.log("Estado atualizado - dataAtual:");
        console.log(dataAtual)
    }, [dataAtual]);

    useEffect(() => {
        console.log("Estado atualizado - diaVisualizado:");
        console.log(diaVisualizado)
    }, [diaVisualizado]);

    useEffect(() => {
        console.log("Estado atualizado - dias:");
        console.log(dias)
    }, [dias]);


    return (
        <div>
            <h1>Diárias</h1>
            <div>
                <RelogioCron trocarDia={trocarDia} />
                <BarraDias
                    tarefasGerais={tarefasGerais}
                    setDiaVisualizado={setDiaVisualizado}
                    setTarefasPorDia={setTarefasPorDia}
                    setDataAtual={setDataAtual}
                    setDias={setDias}
                    dataAtual={dataAtual}
                    diaVisualizado={diaVisualizado}
                    resetarListaDeDias={resetarListaDeDias}
                    dias={dias} />
            </div>
            <ListaTarefas
                tarefas={tarefasPorDia[diaVisualizado] || []}
                setPontuacoes={setPontuacoes}
                setTarefas={(novasTarefas) => {
                    setTarefasPorDia(prev => ({ ...prev, [diaVisualizado]: novasTarefas }));
                    addOrUpdateTarefasPorDia(diaVisualizado, novasTarefas);
                }}
            />
        </div>
    );
};

export default Diarias;
