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
          title="Adicionar Paciente"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Cadastro de Pacientes -->
    <v-container v-else-if="cadastroAberto">
      <v-card class="pa-4">
        <v-row class="text-end" @click="cancelar">
          <v-col>
            <v-btn size="small" class="ma-2" icon="mdi-close" title="Fechar"></v-btn>
          </v-col>
        </v-row>

        <v-card-title class="mb-3"> Novo Paciente </v-card-title>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="paciente.nome"
            :rules="nomeRules"
            :counter="50"
            label="Nome"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-model="paciente.cpf"
            :rules="cpfRules"
            :counter="11"
            type="number"
            label="CPF"
            variant="outlined"
            required
          ></v-text-field>
          <!--adicionar validação de CPF -->

          <v-text-field
            v-model="paciente.celular"
            :rules="celularRules"
            :counter="11"
            label="Celular"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-show="!editarCadastro"
            v-model="paciente.usuario.email"
            :rules="emailRules"
            :counter="30"
            label="E-mail"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-show="!editarCadastro"
            v-model="paciente.usuario.senha"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="senhaRules"
            :type="show1 ? 'text' : 'password'"
            label="Senha"
            variant="outlined"
            :counter="8"
            @click:append="show1 = !show1"
          ></v-text-field>

          <div class="my-2">
            <v-btn
              color="success"
              class="mr-4"
              @click="salvar"

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
          Pacientes
          <v-spacer></v-spacer>
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Nome</th>
              <th class="text-left">Contato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pacientes" :key="item.nome">
              <td>{{ item.nome }}</td>
              <td>{{ item.celular }}</td>
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
  import PacienteRequestHandler from "@/requestHandlers/PacienteRequestHandler"

  export default defineComponent({
    name: "PacientesView",
    data: () => ({
      show1: false,
      alerta: false,
      msgAlerta: "",
      tipoAlerta: "success",
      valid: true,
      cadastroAberto: false,
      editarCadastro: false,
      filtroDeBusca: "",
      pacientes: [],
      paciente: {
        nome: "",
        cpf: "",
        celular: "",
        usuario: {
          email:"",
          senha:""
        }
      },
      cpfRules: [
        (v) => !!v || "Campo CPF é obrigatório",
        (v) => (v && v.length <= 11) || "CPF deve ter 11 caracteres."
      ],
      celularRules: [
        (v) => !!v || "Campo Celular é obrigatório",
        (v) => (v && v.length <= 11) || "Celular deve ter 11 caracteres com DDD."
      ],
      nomeRules: [
        (v) => !!v || "Campo Nome é obrigatório",
        (v) => (v && v.length <= 50) || "Nome deve ter no máximo 50 caracteres."
      ],
      senhaRules: [
        (v) => !!v || "Campo Senha é obrigatório",
        (v) => (v && v.length >= 8) || "Senha deve ter pelo menos 8 caracteres."
      ],
      emailRules: [
        value => {
          if (value) return true

          return 'E-mail é obrigatório'
        },
        value => {
          if (/.+@.+\..+/.test(value)) return true

          return 'E-mail deve ser válido!'
        },
      ]

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

        this.paciente = {
          nome: "",
          cpf: "",
          celular: "",
          usuario: {
          email:"",
          senha:""
          }
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
        let resultado = await PacienteRequestHandler.cadastrar(this.paciente)
        if (resultado.status === 200) {
          this.pacientes.push(this.paciente)

          this.reinicializarForm()
          this.exibirAlerta("Paciente criado com sucesso!", "success")
        }
        else this.exibirAlerta("Erro ao criar Paciente!", "error")
        console.log(resultado.data)
      },
      reset() {
        this.$refs.form.reset()
      },
      async editar() {
        let resultado = await PacienteRequestHandler.editar(this.paciente)
        if(resultado.status === 200) {
          let indiceEdicao = this.pacientes.findIndex(item => {
            return item._id == this.paciente._id ? true : false
          })
          if(indiceEdicao >= 0) {
            this.pacientes[indiceEdicao] = this.paciente
          }
          this.reinicializarForm()
          this.exibirAlerta("Paciente editado com sucesso!", "success")
        }
        else this.exibirAlerta("Erro ao editar Paciente!", "error")
      },
      iconeEditar(paciente) {
        this.editarCadastro = true
        this.paciente = {
          _id: paciente._id,
          nome: paciente.nome,
          cpf: paciente.cpf,
          celular: paciente.celular,
          usuario: paciente.usuario
        }
        this.cadastroAberto = true
      },
      async buscarTodos() {
        let resultado = await PacienteRequestHandler.buscarTodos()
        console.log(resultado)
        this.pacientes = resultado.data
      },
      exibirAlerta(msg, tipo) {
        this.msgAlerta = msg
        this.tipoAlerta = tipo
        this.alerta = true
      }
    }
  })
</script>


