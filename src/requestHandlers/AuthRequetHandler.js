const axios = require("axios");

async function login(data){
    const response = await axios.post(`http://localhost:3000/auth/login`, data)
    return response.data
}

export default {
    login
}
