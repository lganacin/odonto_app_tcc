import axios from "@/requestHandlers/Axios";

export default {
  async buscarTodos() {
    return await axios.get("https://www.directcontrol.dev.br/odonto/pacientes")
  },

  async cadastrar(paciente) {
    return await axios.post("https://www.directcontrol.dev.br/odonto/pacientes", paciente)
  },

  async editar(paciente) {
    return await axios.put(`https://www.directcontrol.dev.br/odonto/pacientes/${paciente._id}`, paciente)
  }
}
