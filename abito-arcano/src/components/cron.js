const cron = require('node-cron');
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://abito-arcano.firebaseapp.com"  

});




const trocarDiaParaUsuario = async (userId) => {
  try {
    console.log(`Iniciando troca de dia para o usuário ${userId}`);
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const dataAtualDate = new Date();
    dataAtualDate.setDate(dataAtualDate.getDate() + 1);
    const novaDataStr = dataAtualDate.toLocaleDateString("pt-BR");

    let diasSalvos = await getDias(userId);

    diasSalvos = diasSalvos.map(dia => {
      if (dia.data === dataAtual) {
        return { ...dia, dataAtual: false };
      } else if (dia.data === novaDataStr) {
        return { ...dia, dataAtual: true };
      }
      return dia;
    });

    const ultimoDia = diasSalvos[diasSalvos.length - 1];
    const ultimoDiaDate = new Date(ultimoDia.data);
    ultimoDiaDate.setDate(ultimoDiaDate.getDate() + 1);
    const novoUltimoDiaStr = ultimoDiaDate.toLocaleDateString("pt-BR");

    const options = { weekday: "long", timeZone: "UTC" };
    const diaSemana = ultimoDiaDate.toLocaleDateString("pt-BR", options);

    const novoDia = {
      data: novoUltimoDiaStr,
      dataAtual: false,
      diaSemana: diaSemana,
      tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
    };

    diasSalvos.push(novoDia);

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
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const usersSnapshot = await admin.firestore().collection('userConfigs').get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const horaTroca = userDoc.data().horaTroca;

      if (horaTroca) {
        const [trocaHora, trocaMinuto] = horaTroca.split(':').map(Number);

        if (
          (currentHour === 0 && currentMinute === 0 && currentSecond === 0) ||
          (currentHour === trocaHora && currentMinute === trocaMinuto && currentSecond === 0)
        ) {
          console.log(`Hora de trocar o dia para o usuário ${userId}`);
          await trocarDiaParaUsuario(userId);
        }
      }
    }
  } catch (error) {
    console.error("Erro ao verificar troca de dia:", error);
  }
};

/*cron.schedule('* * * * *', verificarTrocaDeDia, {
  timezone: "UTC"
});*/

export default async function handler(request, response) {

  await verificarTrocaDeDia();

  response.status(200).send('Troca de dia verificada com sucesso.');

}

console.log("Cron job iniciado, verificando troca de dia a cada minuto.");
