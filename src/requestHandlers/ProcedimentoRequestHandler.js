import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("https://www.directcontrol.dev.br/odonto/procedimentos")
  },

  async cadastrar(procedimento) {
    return await axios.post("https://www.directcontrol.dev.br/odonto/procedimentos", procedimento)
  },

  async editar(procedimento) {
    return await axios.put(`https://www.directcontrol.dev.br/odonto/procedimentos/${procedimento._id}`, procedimento)
  },

  async excluir(id) {
    return await axios.delete(`https://www.directcontrol.dev.br/odonto/procedimentos/${id}`)
  }
}
