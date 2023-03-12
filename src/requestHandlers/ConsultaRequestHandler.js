import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("https://www.directcontrol.dev.br/odonto/consultas/completa")
  },

  async cadastrar(consulta) {
    return await axios.post("https://www.directcontrol.dev.br/odonto/consultas", consulta)
  },

  async editar(consulta) {
    return await axios.put(`https://www.directcontrol.dev.br/odonto/consultas/${consulta._id}`, consulta)
  }
}
