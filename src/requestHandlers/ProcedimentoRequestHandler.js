import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://localhost:3000/procedimentos")
  },

  async cadastrar(procedimento) {
    return await axios.post("http://localhost:3000/procedimentos", procedimento)
  },

  async editar(procedimento) {
    return await axios.put(`http://localhost:3000/procedimentos/${procedimento._id}`, procedimento)
  },

  async excluir(id) {
    return await axios.delete(`http://localhost:3000/procedimentos/${id}`)
  }
}
