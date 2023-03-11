<template>
  <div>
    <v-row class="pa-2">
      <v-alert closable v-model="alerta" :type="tipoAlerta">{{ msgAlerta }}</v-alert>
    </v-row>
    <v-container>
      <v-card class="pa-4">
        <v-card-title class="mb-3"> Novo Cadastro</v-card-title>
        <v-form ref="form" v-model="valid">
          <v-text-field
              v-model="paciente.nome"
              :rules="nomeRules"
              :counter="50"
              label="Nome"
              variant="outlined"
              required
              :disabled="isSSOLogin"
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
              v-model="paciente.usuario.email"
              :rules="emailRules"
              :counter="30"
              label="E-mail"
              variant="outlined"
              required
              :disabled="isSSOLogin"

          ></v-text-field>

          <v-text-field
              v-model="paciente.usuario.senha"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="senhaRules"
              :type="show1 ? 'text' : 'password'"
              label="Senha"
              variant="outlined"
              :counter="8"
              @click:append="show1 = !show1"
              :disabled="isSSOLogin"
              hint="Ao fazer login com o Google não é necessário cadastrar uma senha"
              persistent-hint
          ></v-text-field>

          <div class="my-2">
            <v-btn
                color="success"
                class="mr-4"
                @click="cadastrar"
                :disabled="!valid && !isSSOLogin"
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
  </div>
</template>

<script>
import {defineComponent} from "vue";
import PacienteRequestHandler from "@/requestHandlers/PacienteRequestHandler";

export default defineComponent({
  name: "CadastroView",
  data: () => ({
    sso: {
      token: null,
      email: null,
      role: null
    },
    isSSOLogin: false,
    disabled: false,
    show1: false,
    valid: true,
    alerta: false,
    msgAlerta: "",
    tipoAlerta: "success",
    paciente: {
      nome: "",
      cpf: "",
      celular: "",
      usuario: {
        email: "",
        senha: "",
      }
    },
    cpfRules: [
      (v) => !!v || "Campo CPF é obrigatório",
      (v) => (v && v.length <= 11) || "CPF deve ter 11 caracteres.",
    ],
    celularRules: [
      (v) => !!v || "Campo Celular é obrigatório",
      (v) => (v && v.length <= 11) || "Celular deve ter 11 caracteres com DDD.",
    ],
    nomeRules: [
      (v) => !!v || "Campo Nome é obrigatório",
      (v) => (v && v.length <= 50) || "Nome deve ter no máximo 50 caracteres.",
    ],
    senhaRules: [
      (v) => !!v || "Campo Senha é obrigatório",
      (v) => (v && v.length >= 8) || "Senha deve ter pelo menos 8 caracteres."
    ],
    emailRules: [
      (value) => {
        if (value) return true;

        return "E-mail é obrigatório";
      },
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;

        return "E-mail deve ser válido!";
      },
    ],
  }),
  created() {
    if (location.search) {
      this.inicializarFormComDadosDoGoogle(location.search)
    }
  },
  methods: {
    inicializarFormComDadosDoGoogle(search) {
      const params = new URLSearchParams(search);
      const obj = {};
      for (let [key, value] of params) {
        obj[key] = value;
      }

      if ('isLogin' in obj && obj.isLogin === "false") {
        this.paciente.nome = obj.name;
        this.paciente.usuario.email = obj.email;
        this.paciente.usuario.senha = obj.code;
        this.disabled = true;
        this.isSSOLogin = true;
        this.sso.token = obj.token
        this.sso.email = obj.email
        this.sso.role = obj.role
      }
    },
    cancelar() {
      this.reset();
      this.reinicializarForm();
      this.$router.push({path: '/login'})
    },
    reinicializarForm() {
      this.paciente = {
        nome: "",
        cpf: "",
        celular: "",
        usuario: {
          email: "",
          senha: ""
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    async cadastrar() {
      const isValidLocal = await this.$refs.form.validate()
      if (this.valid || isValidLocal.valid) {
        try {
          await PacienteRequestHandler.cadastrar(this.paciente);
          this.reinicializarForm();
          this.exibirAlerta("Paciente criado com sucesso!", "success");

          if (this.isSSOLogin) {
            this.$store.commit('auth/setLoggedUser', this.sso)
            return this.$router.push({path: '/consultas'})
          }
          return this.$router.push({path: '/login'})
        } catch (error) {
          this.exibirAlerta("Erro ao criar Paciente!", "error");
          console.log(resultado.data);
        }
      }

    },
    exibirAlerta(msg, tipo) {
      this.msgAlerta = msg
      this.tipoAlerta = tipo
      this.alerta = true
    }
  },
});
</script>
