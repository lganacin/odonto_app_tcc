import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://localhost:3000/salas")
  },

  async cadastrar(sala) {
    return await axios.post("http://localhost:3000/salas", sala)
  },

  async editar(sala) {
    return await axios.put(`http://localhost:3000/salas/${sala._id}`, sala)
  }
}
