const cron = require('node-cron');
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://abito-arcano.firebaseapp.com"  

});

import { getDias, inserirDias } from '../src/auth/firebaseDiasHoras';
import { getPontuacoes, updatePontuacoes } from '../src/auth/firebasePontuacoes';
import { getListaTarefas } from '../src/auth/firebaseTarefas';


const converterParaDate = (dataStr) => {
  const [dia, mes, ano] = dataStr.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
};

const trocarDiaParaUsuario = async (userId) => {
  try {
    console.log(`Iniciando troca de dia para o usuário ${userId}`);
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    console.log(`Data atual: ${dataAtual}`);
    
    // Obtenha e log os dados dos dias salvos
    let diasSalvos = await getDias(userId);
   // console.log(`Dias salvos antes da troca: ${JSON.stringify(diasSalvos)}`);
    const tarefasGerais = await getListaTarefas(userId);
    const pontuacoes = await getPontuacoes(userId);
    //console.log("tarefasGerais")
    //console.log(tarefasGerais)
    
    const dataAtualDate = new Date();
    dataAtualDate.setDate(dataAtualDate.getDate() + 1);
    const novaDataStr = dataAtualDate.toLocaleDateString("pt-BR");
    console.log(`Nova data: ${novaDataStr}`);

    diasSalvos = diasSalvos.map(dia => {
      if (dia.data === dataAtual) {
        return { ...dia, dataAtual: false };
      } else if (dia.data === novaDataStr) {
        return { ...dia, dataAtual: true };
      }
      return dia;
    });

    const nwdias = diasSalvos.map(dia => {
      return dia.data;
    });

    const dataatualdodias = diasSalvos.filter(dia => {
      dia.dataAtual === true
    });

    console.log("dataatualdodias.data")
    console.log(dataatualdodias.data)
    console.log("dataatualdodias.dataAtual")
    console.log(dataatualdodias.dataAtual)

    //console.log(`Dias salvos após a atualização: ${JSON.stringify(diasSalvos)}`);nwdias
    console.log(`Dias salvos após a atualização: ${JSON.stringify(nwdias)}`);
    
    const ultimoDia = diasSalvos[diasSalvos.length - 1];
    console.log("ultimoDia.data")
    console.log(ultimoDia.data)
    //const ultimoDiaDate = new Date(ultimoDia.data);
    const ultimoDiaDate = converterParaDate(ultimoDia.data);
    ultimoDiaDate.setDate(ultimoDiaDate.getDate() + 1);
    console.log("ultimoDiaDate")
    console.log(ultimoDiaDate)
    const novoUltimoDiaStr = ultimoDiaDate.toLocaleDateString("pt-BR");
    console.log(`Novo último dia: ${novoUltimoDiaStr}`);

    const options = { weekday: "long", timeZone: "UTC" };
    const diaSemana = ultimoDiaDate.toLocaleDateString("pt-BR", options);
    
    const novoDia = {
      data: novoUltimoDiaStr,
      dataAtual: false,
      diaSemana: diaSemana,
      tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
    };

    console.log("novoDia")
    console.log(novoDia)

    diasSalvos.push(novoDia);

    const diasfinais = diasSalvos.map(dia => {
      return dia.data;
    });

    console.log("diasfinais")
    console.log(diasfinais)

    await inserirDias(userId, diasSalvos);

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
    await updatePontuacoes(userId, novasPontuacoes);

    console.log(`Dia trocado com sucesso para o usuário ${userId}`);
  } catch (error) {
    console.error(`Erro ao trocar dia para o usuário ${userId}:`, error);
  }
};




const verificarTrocaDeDia = async () => {
  try {
    console.log("Verificando troca de dia...");
    
    const usersSnapshot = await admin.firestore().collection('userConfigs').get();
    console.log(`Número de usuários encontrados: ${usersSnapshot.size}`);

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      console.log(`Verificando troca de dia para o usuário ${userId}`);

      await trocarDiaParaUsuario(userId);
    }
  } catch (error) {
    console.error("Erro ao verificar troca de dia:", error);
  }
};


/*cron.schedule('* * * * *', verificarTrocaDeDia, {
  timezone: "UTC"
});*/

export default async function handler(request, response) {
  console.log("Handler chamado!");
  const now = new Date();
  console.log(`Handler chamado em: ${now.toISOString()}`);

  await verificarTrocaDeDia();

  response.status(200).send('Troca de dia verificada com sucesso.');

}

console.log("Cron job iniciado, verificando troca de dia a cada minuto.");
