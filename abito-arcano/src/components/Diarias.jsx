import React, { useState, useEffect } from 'react';
import ListaTarefas from './ListaTarefas';

import { getDias, inserirDias } from '../auth/firebaseDiasHoras';
import { getListaTarefas, updateTarefasPorDia } from '../auth/firebaseTarefas';
import RelogioCron from './RelogioCron';
import BarraDias from './BarraDias';
import { updatePontuacoes } from '../auth/firebasePontuacoes';

const Diarias = ({ user, setPontuacoes, pontuacoes, areas }) => {
    const [tarefasPorDia, setTarefasPorDia] = useState({});
    const [dataAtual, setDataAtual] = useState('');
    const [tarefasGerais, setTarefasGerais] = useState([]);
    const [diaVisualizado, setDiaVisualizado] = useState('');
    const [dias, setDias] = useState([]);

    useEffect(() => {
        console.log("Estado atualizadOOOOOO - tarefasGerais:");
        console.log(tarefasGerais)
    }, [tarefasGerais]);

    useEffect(() => {
        console.log("Estado atualizadOOOOOO - tarefasPorDia:");
        console.log(tarefasPorDia)
    }, [tarefasPorDia]);

    useEffect(() => {
        const fetchData = async () => {
            //resetarListaDeDias()
            let diasSalvos = await getDias(user.uid);

            const tarefasGerais = await getListaTarefas(user.uid);
            setTarefasGerais(tarefasGerais);

            console.log("tarefasGerais fetchdata")
            console.log(tarefasGerais)

           /* if (diasSalvos.length === 0) {
                await resetarListaDeDias();
                diasSalvos = await getDias(user.uid);
            }*/
            console.log("diasSalvos fetchdata")
            console.log(diasSalvos)

            let tarefasPorDiaTemp = {};

            const hoje = new Date().toLocaleDateString('pt-BR');
        const diaAtual = diasSalvos.length > 0 ? diasSalvos.find(dia => dia.dataAtual)?.data : hoje;

        if (diasSalvos.length === 0) {
            console.log("if")
            const novosDias = await resetarListaDeDias();
            setDataAtual(novosDias[0].data);
        } else {
            console.log("else")
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
            // Cria um novo array de dias para os próximos 7 dias
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

            console.log("novosDias");
            console.log(novosDias);

            // Cria a nova estrutura para inserir no Firestore
            const diasComUsuario = {
                userId: user.uid,
                dias: novosDias
            };

            // Insere os novos dias no Firestore
            await inserirDias(diasComUsuario);

            // Atualiza os estados locais
            setDias(novosDias);
            setDataAtual(novosDias[0].data);

            // Filtra as pontuações com base nos novos dias
            const novasPontuacoes = pontuacoes.filter(pontuacao =>
                novosDias.some(dia => dia.data === pontuacao.data)
            );

            console.log("novasPontuacoes");
            console.log(novasPontuacoes);

            // Atualiza as pontuações no Firestore
            await updatePontuacoes(user.uid, novasPontuacoes);

            return novosDias;
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

            let diasSalvos = await getDias(user.uid);
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
            const novoUltimoDiaStr = ultimoDiaDate.toLocaleDateString('pt-BR');

            const novoDia = {
                data: novoUltimoDiaStr,
                dataAtual: false,
                tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
            };

            diasSalvos.push(novoDia);

            await inserirDias(diasSalvos, user.uid);

            setDataAtual(novaDataStr);
            setDiaVisualizado(novaDataStr);

            const novaPontuacao = {
                data: novoUltimoDiaStr,
                areas: pontuacoes[0].areas.map(area => ({
                    areaId: area.areaId,
                    pontos: 0,
                    subareas: area.subareas.map(subarea => ({
                        subareaId: subarea.subareaId,
                        pontos: 0
                    }))
                }))
            };
            const novasPontuacoes = [...pontuacoes, novaPontuacao];
            setPontuacoes(novasPontuacoes);
            await updatePontuacoes(user.uid, novasPontuacoes);


            console.log("Dia trocado com sucesso");
        } catch (error) {
            console.error("Erro ao trocar dia:", error);
        }
    };



    /* useEffect(() => {
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
     }, [dias]);*/


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
                    dias={dias}
                    user={user} />
            </div>
            <ListaTarefas
                tarefas={tarefasPorDia[diaVisualizado] || []}
                setPontuacoes={setPontuacoes}
                setTarefas={(novasTarefas) => {
                    setTarefasPorDia(prev => ({ ...prev, [diaVisualizado]: novasTarefas }));
                    console.log("dentro do set tarefas das diarias")
                    console.log("diaVisualizado")
                    console.log(diaVisualizado)
                    console.log("novasTarefas")
                    console.log(novasTarefas)
                    console.log("user.uid")
                    console.log(user.uid)
                    //updateTarefasPorDia(diaVisualizado, novasTarefas, user.uid);
                }}
                user={user}
                setDias={setDias}
                dias={dias}
                tarefasPorDia={tarefasPorDia}
                setTarefasPorDia={setTarefasPorDia}
                areas={areas}
            />
        </div>
    );
};

export default Diarias;
