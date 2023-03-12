import axios from "@/requestHandlers/Axios";

export default {
    async buscarTodos() {
        return await (await axios.get("http://191.252.210.189:3001/estatistica")).data

    }
}
