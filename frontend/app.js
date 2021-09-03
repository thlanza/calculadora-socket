window.onload = function() {
    //Busca a referência a elementos da página
    var form = document.getElementById("message-form");
    var messagesList = document.getElementById("messages");
    var socketStatus = document.getElementById("status");
    var closeBtn = document.getElementById("close");
    var maisRadio = document.getElementById("r1");
    var menosRadio = document.getElementById("r2");
    var multiplicaRadio = document.getElementById("r3");
    var divideRadio = document.getElementById("r4");
    var input1 = document.getElementById("first");
    var input2 = document.getElementById("second");


    //Cria um novo socket.
    var socket = new WebSocket('ws://localhost:9898/');

    // Função para tratar os erros que podem ocorrer
    socket.onerror = function (error) {
        console.log("WebSocket Error: ", error.message);
    };

    // Função chamada no momento da conexão do cliente com o servidor
    socket.onopen = function (event) {
        socketStatus.innerHTML = 
            "Conectado ao servidor: " + event.currentTarget.url;
        socketStatus.className = "open";
    };

    // Função para tratar mensagens enviadas pelo servidor.
    socket.onmessage = function (event) {
        var message = event.data;
        messagesList.innerHTML +=
            '<li class="received"><span>Resultado da operação:</span>' + message + "</li>";
    }

    // Função chamada no momento da desconexão do servidor com o cliente
    socket.onclose = function (event) {
        socketStatus.innerHTML = "Websocket desconectado.";
        socketStatus.className = "closed";
    };

    // Função que envia mensagens para o servidor através da conexão websocket
    form.onsubmit = function (e) {
        e.preventDefault();

        // Pega a mensagem digitada no campo de mensagem do formulário
        var jsonObject = {};
        if (maisRadio.checked) {
            jsonObject.operacao = document.getElementById('r1').value;
        }
        if (menosRadio.checked) {
            jsonObject.operacao = document.getElementById('r2').value;
        }
        if (multiplicaRadio.checked) {
            jsonObject.operacao = document.getElementById('r3').value;
        }
        if (divideRadio.checked) {
            jsonObject.operacao = document.getElementById('r4').value;
        }

        jsonObject.primeiroOperador = input1.value;
        jsonObject.segundoOperador = input2.value;


        // Envia a mensagem através do websocket
        socket.send(JSON.stringify(jsonObject));

        // Adiciona a mensagem enviada na tela
        messagesList.innerHTML +=
            '<li class="sent"><span>Primeiro operador></span>'  + jsonObject.primeiroOperador+ "</li>" +
            '<li class="sent"><span>Operando></span>'  + jsonObject.operacao+ "</li>" +
            '<li class="sent"><span>Segundo operador></span>'  + jsonObject.segundoOperador + "</li>";

        // Limpa o campo de mensagem
        messageField.value = "";

        return false;
    }

    closeBtn.onclick = function (e) {
        e.preventDefault();

        socket.close();

        return false;
    }
}