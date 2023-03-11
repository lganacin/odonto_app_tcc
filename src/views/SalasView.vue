<template>
  <div>
    <v-row class="pa-2">
      <v-alert closable v-model="alerta" :type="tipoAlerta">{{ msgAlerta }}</v-alert>
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
          title="Adicionar Sala"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Cadastro de Salas -->
    <v-container v-else-if="cadastroAberto">
      <v-card class="pa-4">
        <v-row class="text-end" @click="cancelar">
          <v-col>
            <v-btn size="small" class="ma-2" icon="mdi-close" title="Fechar"></v-btn>
          </v-col>
        </v-row>

        <v-card-title class="mb-3"> Nova Sala </v-card-title>
        <v-form ref="form" v-model="valid">
          <v-text-field
            class="mb-3"
            v-model="sala.numero"
            :counter="3"
            :rules="numeroRules"
            type="number"
            label="Número"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-model="sala.descricao"
            :rules="descricaoRules"
            :counter="30"
            label="Descrição"
            variant="outlined"
            required
          ></v-text-field>

          <div class="my-2">
            <v-btn
              color="success"
              class="mr-4"
              @click="salvar"
              :disabled="!valid"
            >
              Salvar
            </v-btn>

            <v-btn color="error" class="mr-4" @click="cancelar"> Cancelar </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-container>

    <v-container>
      <v-card>
        <v-card-title class="text-center">
          Salas
          <v-spacer></v-spacer>
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Número</th>
              <th class="text-left">Descrição</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in salas" :key="item.numero">
              <td>{{ item.numero }}</td>
              <td>{{ item.descricao }}</td>
              <td class="text-right">
                <v-icon size="small" class="mr-2" title="Editar" @click="iconeEditar(item)">
                  mdi-pencil
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import { defineComponent } from "vue"
  import SalaRequestHandler from "@/requestHandlers/SalaRequestHandler"

  // Components

  export default defineComponent({
    name: "SalasView",
    data: () => ({
      alerta: false,
      msgAlerta: "",
      tipoAlerta: "success",
      valid: true,
      cadastroAberto: false,
      editarCadastro: false,
      filtroDeBusca: "",
      salas: [],
      sala: {
        numero: "",
        descricao: ""
      },
      numeroRules: [
        (v) => !!v || "Campo número é obrigatório",
        (v) => (v && v.length <= 3) || "Número deve ter no máximo 3 caracteres."
      ],
      descricaoRules: [
        (v) => !!v || "Campo de descrição é obrigatório",
        (v) =>
          (v && v.length <= 30) || "Descrição deve ter no máximo 30 caracteres."
      ],

    }),

    mounted() {
      this.buscarTodos()
    },
    methods: {
      cancelar(){
        this.reset()
        this.reinicializarForm()
      },
      reinicializarForm() {
        this.cadastroAberto = this.editarCadastro = false

        this.sala = {
          numero: "",
          descricao: ""
        }
      },
      salvar() {
        if(!this.editarCadastro){
          this.cadastrar()
        }
        else {
          this.editar()
        }
      },
      async cadastrar() {
        let resultado = await SalaRequestHandler.cadastrar(this.sala)
        if (resultado.status === 200) {
          this.salas.push(this.sala)

          this.reinicializarForm()
          this.exibirAlerta("Sala criada com sucesso!", "success")
        }
        else this.exibirAlerta("Erro ao criar Sala!", "error")
      },
      reset() {
        this.$refs.form.reset()
      },
      async editar() {
        let resultado = await SalaRequestHandler.editar(this.sala)
        if(resultado.status === 200) {
          let indiceEdicao = this.salas.findIndex(item => {
            return item._id == this.sala._id ? true : false
          })
          if(indiceEdicao >= 0) {
            this.salas[indiceEdicao] = this.sala
          }
          this.reinicializarForm()
          this.exibirAlerta("Sala editada com sucesso!", "success")
        }
        else this.exibirAlerta("Erro ao editar Sala!", "error")
      },
      iconeEditar(sala) {
        this.editarCadastro = true
        this.sala = {
          _id: sala._id,
          numero: sala.numero,
          descricao: sala.descricao
        }
        this.cadastroAberto = true
      },
      async buscarTodos() {
        let resultado = await SalaRequestHandler.buscarTodos()
        console.log(resultado)
        this.salas = resultado.data
      },
      exibirAlerta(msg, tipo) {
        this.msgAlerta = msg
        this.tipoAlerta = tipo
        this.alerta = true
      }
    }
  })
</script>
