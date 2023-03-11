import axios from "@/requestHandlers/Axios";

export default {
    async buscarTodos() {
        return await (await axios.get("http://localhost:3000/estatistica")).data

    }
}
