const axios = require("axios");

async function login(data){
    const response = await axios.post(`http://191.252.210.189:3001/auth/login`, data)
    return response.data
}

export default {
    login
}
