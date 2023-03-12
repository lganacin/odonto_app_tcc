<template>
  <v-container class="ma-auto">
    <v-card class="ma-auto" max-width="600" min-height="400">
      <div class="d-flex align-center">
        <v-avatar size="100px" class="mx-auto my-4">
          <v-img height="200" src="../assets/logo.jpeg" cover>
          </v-img>
        </v-avatar>
      </div>

      <v-card-title class="text-h4 my-5 text-center">Login</v-card-title>
      <v-card-text class="px-20">
        <v-text-field
            v-model="usuario.email"
            :rules="emailRules"
            :counter="30"
            label="E-mail"
            variant="outlined"
            required

          ></v-text-field>

          <v-text-field
            v-model="usuario.senha"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="senhaRules"
            :type="show1 ? 'text' : 'password'"
            label="Senha"
            variant="outlined"
            :counter="8"
            @click:append="show1 = !show1"
          ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="green" @click="login">Entrar</v-btn>

        <v-btn color="orange" to="/cadastro"> Cadastre-se </v-btn>

        <v-btn color="blue" @click="loginGoogle">Entre com conta Google </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  
</template>

<script>
import { defineComponent } from "vue";
import AuthRequetHandler from "@/requestHandlers/AuthRequetHandler";

export default defineComponent({
  name: "LoginView",
  data: () => ({
    show1: false,
    usuario: {
          email:"",
          senha:""
    },
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
  methods: {
    async login(){
      try {
        let resultado = await AuthRequetHandler.login(this.usuario);
        this.$store.commit('auth/setLoggedUser', resultado)
        this.$router.push({path: '/consultas'})
      } catch (error) {
        console.log(resultado.data);
      }
    },
    loginGoogle(){
      location.href = 'http://191.252.210.189:3001/auth/google'
    }
  }
});
</script>
