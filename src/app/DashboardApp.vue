<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="primary">
      <v-list>
        <v-list-item
            v-for="(item, index) in $store.getters['auth/menu']"
            :key="index"
            link
            router
            :to="item.rota"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icone"></v-icon>
          </template>

          <v-list-item-title v-text="item.titulo"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="secondary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-avatar color="grey-darken-1" size="32">
        <v-img src="../assets/logo.jpeg" alt="Odonto App Logo"></v-img>
      </v-avatar>
      <v-toolbar-title> {{ titulo }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-end"
      >Bem-vindo(a)
      </v-toolbar-title
      >
      <v-btn class="ma-2" icon="mdi-logout" title="Sair" @click="loggout"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DashboardApp",
  methods: {
    loggout() {
      this.$store.commit('auth/removeLoggedUser')
      this.$router.push({path: '/login'})
    }
  },
  data: () => ({
    drawer: null,
    titulo: "Odonto App",
    usuario: {
      nome: "João"
    },
  })
}
</script>
