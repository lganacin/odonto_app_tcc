<template>
  <v-app>
      <router-view></router-view>
  </v-app>
</template>

<script>
import loginView from "@/views/LoginView";
import CadastroView from "@/views/CadastroView";

export default {
  name: "AreaNaoLogada",
  components: {loginView, CadastroView}
}
</script>
