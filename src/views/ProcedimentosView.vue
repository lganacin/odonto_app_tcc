<template>
  <div>
    <v-row class="pa-2">
      <v-alert closable v-model="alerta" :type="tipoAlerta">{{
        msgAlerta
      }}</v-alert>
    </v-row>
    <v-row
      class="text-end"
      v-if="!cadastroAberto"
      @click="cadastroAberto = true"
    >
      <v-col>
        <v-btn
          class="ma-2"
          color="blue"
          icon="mdi-plus"
          title="Adicionar Procedimento"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Cadastro de Procedimentos -->
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

        <v-card-title class="mb-3"> Novo Procedimento </v-card-title>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="procedimento.descricao"
            :rules="descricaoRules"
            :counter="30"
            label="Descrição"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            class="mb-3"
            v-model="procedimento.duracao"
            :counter="3"
            :rules="numeroRules"
            type="number"
            label="Duração (Horas)"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            class="mb-3"
            v-model="procedimento.preco"
            :counter="3"
            :rules="numeroRules"
            type="number"
            label="Preço (R$)"
            variant="outlined"
            required
          ></v-text-field>
          <!--Mudar para float para aparecer preço 150,00-->

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
      <v-card>
        <v-card-title class="text-center">
          Procedimentos
          <v-spacer></v-spacer>
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Descrição</th>
              <th class="text-left">Duração (Horas)</th>
              <th class="text-left">Preço (R$)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in procedimentos" :key="item.descricao">
              <td>{{ item.descricao }}</td>
              <td>{{ item.duracao }}</td>
              <td>{{ item.preco }}</td>
              <td class="text-right">
                <v-icon
                  size="small"
                  class="mr-4"
                  title="Editar"
                  @click="iconeEditar(item)"
                >
                  mdi-pencil
                </v-icon>
                |
                <v-icon
                  size="small"
                  class="ml-4"
                  title="Excluir"
                  @click="iconeExcluir(item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!--Modal para confirmar exclusão-->
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent style="width: 50%">
          <v-card>
            <v-card-title class="text-h5">
              Tem certeza que deseja excluir o Procedimento?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red-darken-1" @click="reinicializarForm">
                Cancelar
              </v-btn>
              <v-btn color="green-darken-1" @click="excluir"> Confirmar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ProcedimentoRequestHandler from "@/requestHandlers/ProcedimentoRequestHandler";

export default defineComponent({
  name: "ProcedimentosView",
  data: () => ({
    dialog: false,
    alerta: false,
    msgAlerta: "",
    tipoAlerta: "success",
    valid: true,
    cadastroAberto: false,
    editarCadastro: false,
    filtroDeBusca: "",
    procedimentos: [],
    procedimento: {
      descricao: "",
      duracao: "",
      preco: "",
    },
    numeroRules: [
      (v) => !!v || "Campo número é obrigatório",
      (v) => (v && v.length <= 4) || "Número deve ter no máximo 4 caracteres.",
    ],
    descricaoRules: [
      (v) => !!v || "Campo de descrição é obrigatório",
      (v) =>
        (v && v.length <= 30) || "Descrição deve ter no máximo 30 caracteres.",
    ],
  }),

  mounted() {
    this.buscarTodos();
  },
  methods: {
    cancelar() {
      this.reset();
      this.reinicializarForm();
    },
    reinicializarForm() {
      this.cadastroAberto = this.editarCadastro = this.dialog = false;

      this.procedimento = {
        descricao: "",
        duracao: "",
        preco: "",
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
      let resultado = await ProcedimentoRequestHandler.cadastrar(
        this.procedimento
      );
      if (resultado.status === 200) {
        this.procedimentos.push(this.procedimento);

        this.reinicializarForm();
        this.exibirAlerta("Procedimento criado com sucesso!", "success");
      } else this.exibirAlerta("Erro ao criar Procedimento!", "error");
      console.log(resultado.data);
    },
    reset() {
      this.$refs.form.reset();
    },
    async editar() {
      let resultado = await ProcedimentoRequestHandler.editar(
        this.procedimento
      );
      if (resultado.status === 200) {
        let indiceEdicao = this.procedimentos.findIndex((item) => {
          return item._id == this.procedimento._id ? true : false;
        });
        if (indiceEdicao >= 0) {
          this.procedimentos[indiceEdicao] = this.procedimento;
        }
        this.reinicializarForm();
        this.exibirAlerta("Procedimento editado com sucesso!", "success");
      } else this.exibirAlerta("Erro ao editar Procedimento!", "error");
    },
    iconeEditar(procedimento) {
      this.editarCadastro = true;
      this.procedimento = {
        _id: procedimento._id,
        descricao: procedimento.descricao,
        duracao: procedimento.duracao,
        preco: procedimento.preco,
      };
      this.cadastroAberto = true;
    },
    iconeExcluir(procedimento) {
      this.procedimento = {
        _id: procedimento._id,
      };
      this.dialog = true;
    },
    async excluir() {
      try {
        let resultado = await ProcedimentoRequestHandler.excluir(this.procedimento._id);

        if (resultado.status === 200) {
          let indiceExclusao = this.procedimentos.findIndex((item) => {
            return item._id == this.procedimento._id ? true : false;
          });
          if (indiceExclusao >= 0) {
            this.procedimentos.splice(indiceExclusao, 1);
          }
          this.reinicializarForm();
          this.exibirAlerta("Procedimento excluído com sucesso!", "success");
        }
      } catch (error) {
        this.reinicializarForm()
        this.exibirAlerta("Erro ao excluir Procedimento!", "error");
      }
    },
    async buscarTodos() {
      let resultado = await ProcedimentoRequestHandler.buscarTodos();
      console.log(resultado);
      this.procedimentos = resultado.data;
    },
    exibirAlerta(msg, tipo) {
      this.msgAlerta = msg;
      this.tipoAlerta = tipo;
      this.alerta = true;
    },
  },
});
</script>
