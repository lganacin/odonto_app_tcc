import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://191.252.210.189:3001/consultas/completa")
  },

  async cadastrar(consulta) {
    return await axios.post("http://191.252.210.189:3001/consultas", consulta)
  },

  async editar(consulta) {
    return await axios.put(`http://191.252.210.189:3001/consultas/${consulta._id}`, consulta)
  }
}
