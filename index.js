const qrcode = require("qrcode-terminal")

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'whatsapp-auth'
    })
});

// Configuração para não ficar refazendo conexão no whatsapp com qrcode

client.on("qr", (qr) => {
  // Conectar o QRCode do Whatsapp
  qrcode.generate(qr, { small: true })
})

// Começa um puppeteer, que é um abre um navegador cliente escondido e os controla.

client.on("ready", () => {
  // Se o qrcode for conectado no zapzap, manda uma mensagem de pronto
  console.log("Client is ready!")
})

client.on('message_create', message => {
	if (message.body === '!ping') {
		// reply back "pong" directly to the message
    // se alguém manda "!ping" o código responde "pong"
		message.reply('pong');
	}
});

// inicializado o cliente
client.initialize()
