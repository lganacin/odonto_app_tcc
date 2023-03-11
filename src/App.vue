<template>
  <div>
    <DashboardApp v-if="$store.state.auth.estaLogado"/>
    <AreaNaoLogada v-else/>
  </div>

</template>

<script>
import DashboardApp from "@/app/DashboardApp";
import AreaNaoLogada from "@/app/AreaNaoLogada";
export default {
  name: "App",
  components: {DashboardApp, AreaNaoLogada},
  data: () => ({
  }),

  beforeMount() {
    const loggedUser = this.getUser();
    if(loggedUser && loggedUser.token) {
      this.$store.commit('auth/setLoggedUser', loggedUser)
      this.$router.push({path: '/consultas'})
    }
  },
  methods: {
    getUser(){
      const sso = this.loginFromLoginSSO();
      if (sso && sso.token) return sso
      return JSON.parse(localStorage.getItem('loggedUser'))
    },
    loginFromLoginSSO(){
      if(location.search) {
        const params = new URLSearchParams(location.search);
        const obj = {};
        for (let [key, value] of params) {
          obj[key] = value;
        }
        if(obj.isLogin === "true") {
          return {
            email: obj.email,
            role: obj.role,
            token: obj.token
          }
        }
        return {}
      }
    }
  }
}
</script>
