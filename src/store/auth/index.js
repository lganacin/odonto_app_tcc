import axios from "@/requestHandlers/Axios";

export default {
    namespaced: true,
    state: () => ({
        estaLogado: false,
        token: null,
        email: null,
        role: null,
        menuAccess: [
            {
                titulo: "Consultas",
                icone: "mdi-calendar-multiple",
                rota: "/consultas",
                roles: ['Gerente', 'Dentista', 'Paciente']
            },
            {
                titulo: "Dentistas",
                icone: "mdi-tooth",
                rota: "/dentistas",
                roles: ['Gerente']
            },
            {
                titulo: "Salas",
                icone: "mdi-door",
                rota: "/salas",
                roles: ['Gerente']
            },
            {
                titulo: "Pacientes",
                icone: "mdi-account-group",
                rota: "/pacientes",
                roles: ['Gerente', 'Dentista']
            },
            {
                titulo: "Procedimentos",
                icone: "mdi-view-list",
                rota: "/procedimentos",
                roles: ['Gerente']
            },
            {
                titulo: "Estatísticas",
                icone: "mdi-chart-line",
                rota: "/estatisticas",
                roles: ['Paciente']
            }
        ]
    }),

    getters: {
        isLogged: (state) => state.estaLogado,
        role: state => state.role,
        menu: state => {
            return state.menuAccess.filter(item => item.roles.includes(state.role))
        }
    },

    mutations: {
        setLoggedUser(state, data) {
            if (data.token) {
                localStorage.setItem('loggedUser', JSON.stringify(data))
                state.estaLogado = true
                state.token = data.token
                state.email = data.email
                state.role = data.role
                axios.defaults.headers.common['authorization'] = `Bearer ${data.token}`
            }
        },

        removeLoggedUser(state) {
            localStorage.removeItem('loggedUser')
            state.estaLogado = false
            state.token = null
            state.email = null
            state.role = null
            axios.defaults.headers.common['authorization'] = null
        }
    }
}
