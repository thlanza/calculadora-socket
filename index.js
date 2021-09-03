const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const calc = require("calculadora-lanza2");

const app = express();

app.use(express.static("./frontend"));



//Inicializa um servidor HTTP orquestrado pelo express
const server = http.createServer(app);

//Inicializa uma instância de servidor websocket a partir do servidor http
const wss = new WebSocket.Server({ server });

// Função responsável por manusear a conexão websocket
wss.on("connection", (ws) => {
    // Função que trata as mensagens recebidas pelo servidor
    ws.on("message", (message) => {
        console.log("Mensagem recebida: ", message.toString());
        messageCleaned = message.toString();
        let parsedObject = JSON.parse(messageCleaned);
        console.log(parsedObject.primeiroOperador);
        console.log(parsedObject.operacao);
        console.log(parsedObject.segundoOperador)
        console.log(messageCleaned);
        let operacao = parsedObject.operacao;
        let primeiroOperador = parsedObject.primeiroOperador;
        let primeiroOperadorInt = parseInt(primeiroOperador);
        let segundoOperador = parsedObject.segundoOperador;
        let segundoOperadorInt = parseInt(segundoOperador);
        let resultado;

        

        switch (operacao) {
            case "+":
            resultado = calc.adicao(primeiroOperadorInt, segundoOperadorInt);
                break;
            case "-":
            resultado = calc.subtracao(primeiroOperadorInt, segundoOperadorInt);
                break;
            case "*":
            try {
                resultado = calc.multiplicacao(primeiroOperadorInt, segundoOperadorInt);
            } catch(erro) {
                resultado = erro.message;
            }
                break;
            case "/":
            try {
                resultado = calc.divisao(primeiroOperadorInt, segundoOperadorInt);
            } catch(erro) {
                resultado = erro.message;
            }
            break;
            default:
                resultado = "";
            break;
        }

        ws.send(resultado);
    });  
});

//Inicia o servidor
server.listen(process.env.PORT || 9898, () => {
    console.log("Servidor conectado na porta: ", server.address().port);
});