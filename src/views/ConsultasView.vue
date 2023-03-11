<template>
  <div>
    <v-row class="pa-2">
      <v-alert closable v-model="alerta" :type="tipoAlerta">{{
        msgAlerta
      }}</v-alert>
    </v-row>
    <v-row class="text-end" v-if="!cadastroAberto">
      <v-col>
        <v-btn
          class="ma-2"
          color="blue"
          icon="mdi-plus"
          title="Adicionar Consulta"
          @click="cadastroAberto = true"
        ></v-btn>
      </v-col>
    </v-row>

    <v-container v-else-if="cadastroAberto">
      <v-card class="pa-4">
        <v-row class="text-end" @click="cancelar">
          <v-col>
            <v-btn
              size="small"
              class="ma-2"
              icon="mdi-close"
              title="Fechar"
            ></v-btn>
          </v-col>
        </v-row>

        <v-card-title class="mb-3"> Nova Consulta </v-card-title>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="consulta.data"
            :rules="descricaoRules"
            :counter="30"
            type="datetime-local"
            label="Data"
            variant="outlined"
            required
          ></v-text-field>
          <!--colocar datetime, precisamos da hora tbm-->

          <v-autocomplete
            v-model="consulta.paciente"
            label="Paciente"
            :items="pacientes"
            item-title="nome"
            return-object
            variant="outlined"
          ></v-autocomplete>

          <v-autocomplete
            v-model="consulta.dentista"
            label="Dentista"
            :items="dentistas"
            item-title="nome"
            return-object
            variant="outlined"
          ></v-autocomplete>

          <v-autocomplete
            v-model="consulta.sala"
            label="Sala"
            :items="salas"
            item-title="descricao"
            return-object
            variant="outlined"
          ></v-autocomplete>
          <!--colocar uma combo-box com todas as salas -->

          <v-autocomplete
            v-model="consulta.procedimento"
            label="Procedimento"
            :items="procedimentos"
            item-title="descricao"
            return-object
            variant="outlined"
          ></v-autocomplete>
          <!--colocar uma combo-box com todos os procedimentos -->

          <div class="my-2">
            <v-btn
              color="success"
              class="mr-4"
              @click="salvar"
              :disabled="!valid"
            >
              Salvar
            </v-btn>

            <v-btn color="error" class="mr-4" @click="cancelar">
              Cancelar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-container>

    <v-container>
      <v-card class="mb-10">
        <v-card-title class="text-center">
          Consultas
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>

      <v-container fluid>
        <v-row class="text-left">
          <v-card
            v-for="consulta in consultas"
            :key="consulta._id"
            class="ma-4"
            width="300"
            color="#FFF59D"
          >
            <v-card-title> Consultas </v-card-title>

            <v-card-subtitle class="text-black, mt-2">
              <b>Data:</b> {{ converterData(consulta.data) }}
            </v-card-subtitle>
            <v-card-subtitle class="text-black, mt-1">
              <b>Hora:</b> {{ converterHora(consulta.data) }}
            </v-card-subtitle>
            <v-card-subtitle class="text-black, mt-1">
              <b>Paciente:</b> {{ consulta.paciente?.nome || 'Sem nome' }}
            </v-card-subtitle>
            <v-card-subtitle class="text-black, mt-1">
              <b>Dentista:</b> {{ consulta.dentista?.nome || 'Sem nome' }}
            </v-card-subtitle>
            <v-card-subtitle class="text-black, mt-1">
              <b>Sala:</b> {{ consulta.sala.descricao }}
            </v-card-subtitle>
            <v-card-subtitle class="text-black, mt-1">
              <b>Procedimento:</b> {{ consulta.procedimento.descricao }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn
                class="mt-2"
                color="orange-darken-2"
                title="Editar"
                @click="iconeEditar(consulta)"
              >
                Editar/Remarcar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ConsultaRequestHandler from "@/requestHandlers/ConsultaRequestHandler";
import DentistaRequestHandler from "@/requestHandlers/DentistaRequestHandler";
import PacienteRequestHandler from "@/requestHandlers/PacienteRequestHandler";
import ProcedimentoRequestHandler from "@/requestHandlers/ProcedimentoRequestHandler";
import SalaRequestHandler from "@/requestHandlers/SalaRequestHandler";
import {
  getDataAtual,
  getDataFormatada,
  getDataInput,
  getHoraFormatada,
} from "@/utils/FormaterUtils";

export default defineComponent({
  name: "ConsultasView",
  data: () => ({
    alerta: false,
    msgAlerta: "",
    tipoAlerta: "success",
    dentistas: [],
    pacientes: [],
    procedimentos: [],
    salas: [],
    valid: true,
    cadastroAberto: false,
    editarCadastro: false,
    filtroDeBusca: "",
    consultas: [],
    consulta: {
      data: "",
      paciente: {
        nome: ""
      },
      dentista: "",
      sala: "",
      procedimento: "",
    },
    numeroRules: [
      (v) => !!v || "Campo número é obrigatório",
      (v) =>
        (v && v.length <= 11) || "Número deve ter no máximo 11 caracteres.",
    ],
    descricaoRules: [
      (v) => !!v || "Campo de descrição é obrigatório",
      (v) =>
        (v && v.length <= 30) || "Descrição deve ter no máximo 30 caracteres.",
    ],
  }),

 async mounted() {
    try {
      await this.buscarTodos();
      await this.buscarDentistas();
      await this.buscarPacientes();
      await this.buscarSalas();
      await this.buscarProcedimentos();
      this.inserirData();

    } catch (e) {
      console.log('error', e)
    }
  },
  methods: {
    inserirData() {
      this.consulta.data = getDataAtual();
    },
    converterData(data) {
      return getDataFormatada(data);
    },
    converterHora(data) {
      return getHoraFormatada(data);
    },
    dataInput(data) {
      return getDataInput(data);
    },
    cancelar() {
      this.reset();
      this.reinicializarForm();
    },
    reinicializarForm() {
      this.cadastroAberto = this.editarCadastro = false;

      this.consulta = {
        data: "",
        paciente: {
          nome: ""
        },

        dentista: "",
        sala: "",
        procedimento: "",
      };
    },
    salvar() {
      if (!this.editarCadastro) {
        this.cadastrar();
      } else {
        this.editar();
      }
    },
    async cadastrar() {
      try {
        let resultado = await ConsultaRequestHandler.cadastrar(this.consulta);
        if (resultado.status === 200) {
          this.consultas.push(this.consulta);

          this.reinicializarForm();
          this.exibirAlerta("Consulta criado(a) com sucesso!", "success");
        }
      } catch (error) {
        this.exibirAlerta("Erro ao criar Consulta!", "error");
        console.log(resultado.data);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    async editar() {
      try {
        let resultado = await ConsultaRequestHandler.editar(this.consulta);

        if (resultado.status === 200) {
          let indiceEdicao = this.consultas.findIndex((item) => {
            return item._id == this.consulta._id ? true : false;
          });
          if (indiceEdicao >= 0) {
            this.consultas[indiceEdicao] = this.consulta;
          }
          this.reinicializarForm();
          this.exibirAlerta("Consulta editado(a) com sucesso!", "success");
        }
      } catch (error) {
        this.exibirAlerta("Erro ao editar Consulta!", "error");
      }
    },
    iconeEditar(consulta) {
      this.editarCadastro = true;
      this.consulta = {
        _id: consulta._id,
        data: this.dataInput(consulta.data),
        paciente: consulta.paciente,
        dentista: consulta.dentista,
        sala: consulta.sala,
        procedimento: consulta.procedimento,
      };
      console.log(this.consulta);
      this.cadastroAberto = true;
    },
    async buscarTodos() {
      let resultado = await ConsultaRequestHandler.buscarTodos();
      this.consultas = resultado.data;
    },
    async buscarDentistas() {
      let resultado = await DentistaRequestHandler.buscarTodos();
      this.dentistas = resultado.data;
    },
    async buscarPacientes() {
      let resultado = await PacienteRequestHandler.buscarTodos();
      this.pacientes = resultado.data;
    },
    async buscarProcedimentos() {
      let resultado = await ProcedimentoRequestHandler.buscarTodos();
      this.procedimentos = resultado.data;
    },
    async buscarSalas() {
      let resultado = await SalaRequestHandler.buscarTodos();
      this.salas = resultado.data;
    },
    exibirAlerta(msg, tipo) {
      this.msgAlerta = msg;
      this.tipoAlerta = tipo;
      this.alerta = true;
    },
  },
});
</script>
