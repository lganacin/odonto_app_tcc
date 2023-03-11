<template>
  <v-card class="ma-auto" max-width="1500" min-height="600">
    <div>
      <canvas id="myChart"></canvas>
    </div>
  </v-card>
</template>

<script>

import estatisticaRequestHandler from "@/requestHandlers/estatisticaRequestHandler";

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubo', 'Novembro', 'Dezembro']
export default {
  async mounted() {
    const dados = await estatisticaRequestHandler.buscarTodos()
    const ctx = document.getElementById('myChart');
    const DADOS_PARA_GRAFICO = []
    for (let i = 0; i < MESES.length; i++) {
      const valor = dados[i+1]
      DADOS_PARA_GRAFICO.push(valor)
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MESES,
        datasets: [{
          label: 'Quantidade de atendimento por mês',
          data: DADOS_PARA_GRAFICO,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }
}


</script>


