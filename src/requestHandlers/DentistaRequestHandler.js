import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://191.252.210.189:3001/dentistas")
  },

  async cadastrar(dentista) {
    return await axios.post("http://191.252.210.189:3001/dentistas", dentista)
  },

  async editar(dentista) {
    return await axios.put(`http://191.252.210.189:3001/dentistas/${dentista._id}`, dentista)
  }
}
