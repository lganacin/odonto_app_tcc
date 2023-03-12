import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("https://www.directcontrol.dev.br/odonto/salas")
  },

  async cadastrar(sala) {
    return await axios.post("https://www.directcontrol.dev.br/odonto/salas", sala)
  },

  async editar(sala) {
    return await axios.put(`https://www.directcontrol.dev.br/odonto/salas/${sala._id}`, sala)
  }
}
