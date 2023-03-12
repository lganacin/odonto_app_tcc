import axios from "@/requestHandlers/Axios";

export default {
    async buscarTodos() {
        return await (await axios.get("https://www.directcontrol.dev.br/odonto/estatistica")).data

    }
}
