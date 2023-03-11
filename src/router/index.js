import { createRouter, createWebHistory } from "vue-router"
import ConsultasView from "../views/ConsultasView.vue"
import store from '@/store'

const routes = [
  {
    path: "/consultas",
    name: "Consultas",
    component: ConsultasView,
    meta: { requiresAuth: true, roles: ['Gerente', 'Dentista', 'Paciente'] }
  },
  {
    path: "/dentistas",
    name: "Dentistas",
    component: () => import("../views/DentistasView.vue"),
    meta: { requiresAuth: true, roles: ['Gerente'] }
  },
  {
    path: "/salas",
    name: "Salas",
    component: () => import("../views/SalasView.vue"),
    meta: { requiresAuth: true, roles: ['Gerente'] }
  },
  {
    path: "/pacientes",
    name: "Pacientes",
    component: () => import("../views/PacientesView.vue"),
    meta: { requiresAuth: true, roles: ['Gerente', 'Dentista'] }
  },
  {
    path: "/procedimentos",
    name: "Procedimentos",
    component: () => import("../views/ProcedimentosView.vue"),
    meta: { requiresAuth: true, roles: ['Gerente'] }
  },
  {
    path: "/estatisticas",
    name: "Estatisticas",
    component: () => import("../views/EstatisticasView.vue"),
    meta: { requiresAuth: true, roles: ['Paciente'] }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/cadastro",
    name: "Cadastro",
    component: () => import("../views/CadastroView.vue"),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
const rotasNaoLogadas = ['Cadastro', 'Login']
router.beforeEach((to, from, next) => {
  const logged = store.getters['auth/isLogged']
  const role = store.getters['auth/role']

  const isNotLoggedRoute = rotasNaoLogadas.includes(to.name)

  if(isNotLoggedRoute && !logged) {
    return next()
  }

  if(to.meta.requiresAuth && logged && !isNotLoggedRoute && to.meta.roles.includes(role)) {
      return next()
  }

  return next({ name: 'Login' })
})
export default router
