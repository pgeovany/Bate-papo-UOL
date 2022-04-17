const userName = {
    name: prompt("Qual o seu nome?")
}

const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);

request.then(handleSuccess);
//request.catch(handleError);

function handleSuccess(response) {
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(renderMessages);
}

function pingServer () {
    let pingStatus = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
}

setInterval(pingServer, 4000);
setInterval(handleSuccess, 3000);

function renderMessages(response) {
    //console.log(response.data.length);
//     statusMessages = response.data.filter(index => index.type === 'status');
//     privateMessages = response.data.filter(index => index.type === 'private_message');
//     messages = response.data.filter(index => index.type === 'message');
//     console.log(statusMessages);
//     console.log(privateMessages);
//     console.log(messages);
//
    let content = document.querySelector(".messages");
    for (let i = 0; i < response.data.length; i++) {
        if(response.data[i].type === 'status'){
            content.innerHTML += `
            <li class="${response.data[i].type}">
                (${response.data[i].time}) 
                <strong>${response.data[i].from}</strong>
                ${response.data[i].text}
            </li>
            `
        }
        if(response.data[i].type === 'message') {
            content.innerHTML += `
            <li class="${response.data[i].type}">
                (${response.data[i].time}) 
                <strong>${response.data[i].from}</strong> para 
                <strong>${response.data[i].to}</strong>:
                ${response.data[i].text}
            </li>
            `
        }
        if(response.data[i].to === userName.name){
            content.innerHTML += `
            <li class="${response.data[i].type}">
                (${response.data[i].time}) 
                <strong>${response.data[i].from}</strong> reservadamente para 
                <strong>${response.data[i].to}</strong>:
                ${response.data[i].text}
            </li>
            `
        }
    }
    content.scrollIntoView(false);
}

function sendMessage() {
   let message = {
       from: userName.name,
       to: "Todos",
       text: document.querySelector("input").value,
       type: "message"
   }
   console.log(message);
   const sendRequest = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message);
}