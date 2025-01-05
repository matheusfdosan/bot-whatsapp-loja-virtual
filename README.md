<h1 align="center"> Como usar o whatsapp-web.js? </h1>

<p align="center">
Este projeto é um chatbot interativo para WhatsApp, desenvolvido em JavaScript, que funciona como uma extensão para lojas virtuais e catálogos de produtos. Ele é projetado para facilitar o atendimento ao cliente, ajudar na navegação pelos produtos e até mesmo realizar pedidos diretamente na conversa.
</p>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-contato">Contato</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

<br>

<p align="center">
  <img alt="bot-whatsapp-preview" src=".github/preview.png" width="100%" style='border-radius: 10px'>
</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- JavaScript
- Biblioteca **whatsapp-web.js** e **qrcode-terminal**
- Node.js

## 💻 Projeto

Primeiramente, iniciamos um projeto com `npm init -y`, e depois instalamos as dependecias necessárias para o funcionamento do bot:

- `npm i whatsapp-web.js`:libera opções para funcionalidade do bot.
- `npm i qrcode-terminal`: para fazermos a conexão com o whatsapp via qrcode no terminal.

Em seguida, criamos um arquivo _index.js_, nele iniciamos as importações e configurações, depois seguimos para as funções do bot:

## Importações e configurações

Para iniciarmos, vamos importar o `qrcode-terminal` e importar o cliente do whatsapp-web.js, esse cliente é o responsável por mandar as mensagens pelo Whatsapp:

```js
const qrcode = require("qrcode-terminal")
const { Client } = require("whatsapp-web.js")
```

Com todas as importações feitas, podemos fazer configurações importantes para o bot. A principal e única configuração é conservar a autenticação do usuário. Como se fosse o "Lembre-se de mim" num formulário.

Toda vez que o código for executado, as informações de acesso do Whatsapp do cliente será mantido numa pasta, e assim, não precisar se conectar no whatsapp toda vez que o código é executado:

```js
const { Client, LocalAuth } = require("whatsapp-web.js")
// importamos o LocalAuth junto
const client = new Client({
  // também estamos instanciando o cliente (como se fosse o express)
  authStrategy: new LocalAuth({
    dataPath: "whatsapp-auth",
  }),
})
```

- `dataPath: "whatsapp-auth"`: esse é o nome da pasta onde será guardada as informações de acesso do cliente ao Whatsapp.

## Funções do bot (Respostas)

Se você já utilizou [express.js](https://expressjs.com/pt-br/), pode identificar uma certa semelhança. Agora, vamos iniciar no terminal a geração do qrcode para o usuário se conectar ao Whatsapp.

```js
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true })
})
```

Esse código usa um **puppeteer**, que abre um navegador cliente invisível e o controla. O navegador funciona sem uma interface gráfica (não aparece na tela). Porém, após a conexão, precisamos avisar que houve uma conexão bem sucedida. Fazemos isso por meio desse código:

```js
client.on("ready", () => {
  console.log("Client is ready!")
})
```

Depois disso, partimos para respostas à menagens. O código verifica a mensagem de todos os contatos, e se algum mandar a especifica mensagem de "!ping" (ou qualquer coisa que possa ser), o bot responde "pong":

```js
client.on("message_create", (message) => {
  if (message.body === "!ping") {
    message.reply("pong")
  }
})
```

> E por fim, sempre coloque `client.initialize()` no final do código. Sempre na última linha.

Essa foi a lógica utilizada para a criação do bot de loja virtual.

## Contato

- Acesse também meus outros repositórios no [Github](https://github.com/matheusfdosan?tab=repositories).

- Também me siga no [Instagram](https://instagram.com/matheusfdosan).
