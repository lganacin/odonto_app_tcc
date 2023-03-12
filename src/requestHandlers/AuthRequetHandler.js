const axios = require("axios");

async function login(data){
    const response = await axios.post(`https://www.directcontrol.dev.br/odonto/auth/login`, data)
    return response.data
}

export default {
    login
}
