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
          title="Adicionar Dentista"
        ></v-btn>
      </v-col>
    </v-row>

    <!-- Cadastro de Dentistas -->
    <v-container v-else-if="cadastroAberto">
      <v-card class="pa-4">
        <v-row class="text-end" @click="cancelar">
          <v-col>
            <v-btn size="small" class="ma-2" icon="mdi-close" title="Fechar"></v-btn>
          </v-col>
        </v-row>

        <v-card-title class="mb-3"> Novo Dentista </v-card-title>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="dentista.nome"
            :rules="descricaoRules"
            :counter="30"
            label="Nome"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-model="dentista.cpf"
            :counter="11"
            :rules="numeroRules"
            type="number"
            label="CPF"
            variant="outlined"
            required
          ></v-text-field>
          <!--adicionar validação de CPF -->

          <v-text-field
            v-model="dentista.celular"
            :rules="descricaoRules"
            :counter="30"
            label="Celular"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-model="dentista.area"
            :rules="descricaoRules"
            :counter="30"
            label="Área de atuação"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-show="!editarCadastro"
            v-model="dentista.usuario.email"
            :rules="emailRules"
            :counter="30"
            label="E-mail"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-show="!editarCadastro"
            v-model="dentista.usuario.senha"
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
          Dentistas
          <v-spacer></v-spacer>
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Nome (Drº / Drª)</th>
              <th class="text-left">Contato</th>
              <th class="text-left">Área de atuação</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dentistas" :key="item.nome">
              <td>{{ item.nome }}</td>
              <td>{{ item.celular }}</td>
              <td>{{ item.area }}</td>
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
  import DentistaRequestHandler from "@/requestHandlers/DentistaRequestHandler"

  export default defineComponent({
    name: "DentistasView",
    data: () => ({
      alerta: false,
      msgAlerta: "",
      tipoAlerta: "success",
      valid: true,
      cadastroAberto: false,
      editarCadastro: false,
      filtroDeBusca: "",
      dentistas: [],
      dentista: {
        nome: "",
        cpf: "",
        celular: "",
        area: "",
        usuario: {
          email:"",
          senha:""
        }
      },
      numeroRules: [
        (v) => !!v || "Campo número é obrigatório",
        (v) => (v && v.length <= 11) || "Número deve ter no máximo 11 caracteres."
      ],
      descricaoRules: [
        (v) => !!v || "Campo de descrição é obrigatório",
        (v) =>
          (v && v.length <= 30) || "Descrição deve ter no máximo 30 caracteres."
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

    async mounted() {
      await this.buscarTodos()
    },
    methods: {
      cancelar(){
        this.reset()
        this.reinicializarForm()
      },
      reinicializarForm() {
        this.cadastroAberto = this.editarCadastro = false

        this.dentista = {
          nome: "",
          cpf: "",
          celular: "",
          area: "",
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
        let resultado = await DentistaRequestHandler.cadastrar(this.dentista)
        if (resultado.status === 200) {
          this.dentistas.push(this.dentista)

          this.reinicializarForm()
          this.exibirAlerta("Dentista criado(a) com sucesso!", "success")
        }
        else this.exibirAlerta("Erro ao criar Dentista!", "error")
        console.log(resultado.data)
      },
      reset() {
        this.$refs.form.reset()
      },
      async editar() {
        let resultado = await DentistaRequestHandler.editar(this.dentista)
        if(resultado.status === 200) {
          let indiceEdicao = this.dentistas.findIndex(item => {
            return item._id == this.dentista._id ? true : false
          })
          if(indiceEdicao >= 0) {
            this.dentistas[indiceEdicao] = this.dentista
          }
          this.reinicializarForm()
          this.exibirAlerta("Dentista editado(a) com sucesso!", "success")
        }
        else this.exibirAlerta("Erro ao editar Paciente!", "error")
      },
      iconeEditar(dentista) {
        this.editarCadastro = true
        this.dentista = {
          _id: dentista._id,
          nome: dentista.nome,
          cpf: dentista.cpf,
          celular: dentista.celular,
          area: dentista.area,
          usuario:   {
            email:dentista.usuario.email,
            senha:dentista.usuario.senha
          }
        }
        this.cadastroAberto = true
      },
      async buscarTodos() {
        let resultado = await DentistaRequestHandler.buscarTodos()
        console.log(resultado)
        this.dentistas = resultado.data
      },
      exibirAlerta(msg, tipo) {
        this.msgAlerta = msg
        this.tipoAlerta = tipo
        this.alerta = true
      }
    }
  })
</script>

