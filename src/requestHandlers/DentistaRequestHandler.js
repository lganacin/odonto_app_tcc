import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("https://www.directcontrol.dev.br/odonto/dentistas")
  },

  async cadastrar(dentista) {
    return await axios.post("https://www.directcontrol.dev.br/odonto/dentistas", dentista)
  },

  async editar(dentista) {
    return await axios.put(`https://www.directcontrol.dev.br/odonto/dentistas/${dentista._id}`, dentista)
  }
}
