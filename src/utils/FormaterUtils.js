module.exports = {
    getDataFormatada(dataISO){
        const date = new Intl.DateTimeFormat("pt-BR").format(new Date(dataISO))
        console.log(date) 
        return date
    },

    getHoraFormatada(dataISO){
        const dateTime = new Intl.DateTimeFormat("pt-BR", {hour:"numeric", minute:"numeric", hourCycle:"h23"}).format(new Date(dataISO))
        console.log(dateTime) 
        return dateTime
    },

    getDataInput(dataISO){
        var data = new Date(dataISO)
        var dia = data.getDate().toString().padStart(2, '0')
        var mes = (data.getMonth() + 1).toString().padStart(2, '0')
        const ano = data.getFullYear()
        const hora = data.getHours().toString().padStart(2, '0')
        const minuto = data.getMinutes().toString().padStart(2, '0')
        return `${ano}-${mes}-${dia}T${hora}:${minuto}` 
        //formato desejado: yyyy-MM-ddThh:mm 
    },

    getDataAtual(){
        let today = new Date();
        let date = today.getFullYear() + '-' +
        (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
        today.getDate().toString().padStart(2, '0');
        let time = today.getHours().toString().padStart(2, '0') + ':' 
        + today.getMinutes().toString().padStart(2, '0');
        return date + 'T' + time;
    }
}
