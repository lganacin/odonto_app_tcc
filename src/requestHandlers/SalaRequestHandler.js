import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://191.252.210.189:3001/salas")
  },

  async cadastrar(sala) {
    return await axios.post("http://191.252.210.189:3001/salas", sala)
  },

  async editar(sala) {
    return await axios.put(`http://191.252.210.189:3001/salas/${sala._id}`, sala)
  }
}
