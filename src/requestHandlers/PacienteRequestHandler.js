import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://localhost:3000/pacientes")
  },

  async cadastrar(paciente) {
    return await axios.post("http://localhost:3000/pacientes", paciente)
  },

  async editar(paciente) {
    return await axios.put(`http://localhost:3000/pacientes/${paciente._id}`, paciente)
  }
}
