const userName = {
    name: prompt("Qual o seu nome?")
}

getMessages();
logIn();

function logIn() {
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    request.then(handleSuccess);
    request.catch(handleError);
}

function handleSuccess(response) {
    setInterval(pingServer, 4000);
    setInterval(getMessages, 3000);
}

function handleError(error) {
    if(error.response.status === 400) {
        userName.name = prompt("Esse nome já está em uso. Por favor, escolha outro nome.");
        logIn();
    }
}

function getMessages () {
    const promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(renderMessages);
}

function pingServer () {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
}

function renderMessages(response) {

    let content = document.querySelector(".messages");
    content.innerHTML = '';
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
        if(response.data[i].type === 'private_message' && response.data[i].to === userName.name){
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
    content.querySelector("li:last-child").scrollIntoView();
}

function sendMessage() {
   let message = {
       from: userName.name,
       to: "Todos",
       text: document.querySelector("input").value,
       type: "message"
   }
   const sendRequest = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message);
   document.querySelector("input").value="";
   sendRequest.then(sendMessageSuccess);
   sendRequest.catch(sendMessageError);
}

function sendMessageSuccess(response) {
    getMessages();
}

function sendMessageError(error) {
    if(error.response.status === 400) {
        alert("Você não está online! Por favor, faça login novamente.");
        window.location.reload();
    }
}

document.querySelector("input").addEventListener("keyup", event => {
    if(event.key === "Enter"){
        sendMessage();
    }
})