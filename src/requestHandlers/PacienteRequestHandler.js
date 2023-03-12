import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("http://191.252.210.189:3001/pacientes")
  },

  async cadastrar(paciente) {
    return await axios.post("http://191.252.210.189:3001/pacientes", paciente)
  },

  async editar(paciente) {
    return await axios.put(`http://191.252.210.189:3001/pacientes/${paciente._id}`, paciente)
  }
}
