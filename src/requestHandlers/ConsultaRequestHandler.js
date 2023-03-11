import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://localhost:3000/consultas/completa")
  },

  async cadastrar(consulta) {
    return await axios.post("http://localhost:3000/consultas", consulta)
  },

  async editar(consulta) {
    return await axios.put(`http://localhost:3000/consultas/${consulta._id}`, consulta)
  }
}
