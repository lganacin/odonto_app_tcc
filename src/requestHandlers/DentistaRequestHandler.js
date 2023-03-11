import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://localhost:3000/dentistas")
  },

  async cadastrar(dentista) {
    return await axios.post("http://localhost:3000/dentistas", dentista)
  },

  async editar(dentista) {
    return await axios.put(`http://localhost:3000/dentistas/${dentista._id}`, dentista)
  }
}
