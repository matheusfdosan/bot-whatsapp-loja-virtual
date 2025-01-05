// By Matheus Faustino
const qrcode = require("qrcode-terminal")

const { Client, LocalAuth } = require("whatsapp-web.js")
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "whatsapp-auth",
  }),
})

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true })
  console.log("Faça conexão com o seu Whatsapp via QrCode")
})

client.on("ready", () => {
  console.log("Cliente conectado com sucesso!")
})

client.on("disconnected", (reason) => {
  console.log("Cliente desconectado. Motivo: ", reason)
})

client.on("auth_failure", () => {
  console.log("Falha na autenticação. Verifique o QR code ou sessão.")
})

let botState = "menu"
let shop_cart = []
let shop_cart_prices = []
let shop_cart_price = 0

function showMenu() {
  return `*Loja Virtual*: 👋 Olá, seja bem-vindo à nossa Loja Virtual! 🎉
Estamos aqui para ajudar você a encontrar os produtos que deseja de maneira rápida e prática.
    
Escolha uma das opções abaixo para começar:
    
1️⃣ Ver Catálogo de Produtos
2️⃣ Ver meu Carrinho de Compras
3️⃣ Finalizar Compra com Pix

Digite o número da opção ou escreva "!fecharloja" para finalizar o atendimento!`
}

function showCatalog() {
  return `*Loja Virtual*: 🛍️ Ótima escolha! Vamos explorar nosso catálogo de produtos.

Aqui estão algumas categorias para você escolher:

1️⃣ Roupas e Acessórios
2️⃣ Tecnologia e Gadgets
3️⃣ Casa e Decoração

Digite o número da categoria que você deseja explorar, ou se preferir, digite "voltar"para retornar ao menu! 😊`
}

client.on("message_create", (message) => {
  // ----------------------- MENU -----------------------
  if (botState === "menu" && message.body === "!loja") {
    message.reply(showMenu())
    console.log("Store Open!")
    return
  }

  if (botState === "menu" && message.body === "1") {
    message.reply(showCatalog())
    botState = "catalog"
    return
  } else if (botState === "menu" && message.body === "2") {
    if (shop_cart.length === 0) {
      message.reply(`Seu carrinho está vazio.

1️⃣ Voltar para o menu`)
    } else if (shop_cart.length > 0) {
      message.reply(`*Loja Virtual*: 🛒 Seu Carrinho de Compras

Aqui estão os itens que você adicionou ao carrinho:

${shop_cart.map((p, i) => `*Produto ${i + 1}*: ${p}`).join("\n\n")}

Total: R$ ${shop_cart_prices.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        shop_cart_price
      )}
      
👉 Digite "limpar" para tirar todos os itens do carrinho ou digite "voltar" para retornar ao menu.`)
    }

    botState = "shopping_cart"
    return
  } else if (botState === "menu" && message.body === "3") {
    message.reply(`Bot:
💳 Finalizar Compra com Pix 💸

Aqui está o resumo do seu pedido:

${shop_cart.map((p, i) => `*Produto ${i + 1}*: ${p}`).join("\n\n")}

Preço: R$ ${shop_cart_prices.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      shop_cart_price
    )}

Para realizar o pagamento via Pix, siga os passos abaixo:

1️⃣ Copie e cole esta chave Pix no app: email.ficticio@pix.com.br
2️⃣ Voltar ao menu

Após o pagamento, envie o comprovante aqui no chat para confirmarmos o seu pedido. 📩

🚚 Assim que confirmado, enviaremos a atualização do status do seu pedido. Obrigado por comprar conosco! 😊`)
    botState = "finalize_purchase"
    return
  }

  // ----------------------- CATALOG -----------------------
  if (botState === "catalog" && message.body === "1") {
    message.reply(`*Loja Virtual*: 👗 Roupas e Acessórios 👕

Aqui estão alguns itens que você pode gostar:

1️⃣ Camiseta Básica Unissex
Preço: R$ 49,90
Descrição: Disponível em várias cores e tamanhos. Feita com algodão premium.

2️⃣ Jaqueta Jeans Oversized
Preço: R$ 159,90
Descrição: Um clássico atemporal, disponível nos tamanhos P, M, G e GG.

3️⃣ Relógio Minimalista
Preço: R$ 199,90
Descrição: Design moderno com pulseira de couro ajustável.

4️⃣ Mochila Casual
Preço: R$ 129,90
Descrição: Espaçosa e resistente, ideal para o dia a dia.

5️⃣ Óculos de Sol Vintage
Preço: R$ 89,90
Descrição: Estilo retrô com proteção UV400.

👉 Digite o número do item para adicioná-lo ao seu carrinho ou escreva "voltar" para retornar ao menu anterior. 😊`)
    botState = "clothes_accessories"
    return
  } else if (botState === "catalog" && message.body === "2") {
    message.reply(`*Loja Virtual*: 📱 Tecnologia e Gadgets 💻
    
Aqui estão algumas opções incríveis para você explorar:

1️⃣ Fone de Ouvido Bluetooth
Preço: R$ 129,90
Descrição: Som de alta qualidade, bateria de longa duração e compatibilidade universal.

2️⃣ Carregador Portátil (Power Bank)
Preço: R$ 179,90
Descrição: Capacidade de 20.000 mAh, ideal para recarregar seus dispositivos em qualquer lugar.

3️⃣ Smartwatch Esportivo
Preço: R$ 299,90
Descrição: Monitoramento de atividades físicas, batimentos cardíacos e notificações do celular.

4️⃣ Teclado Mecânico RGB
Preço: R$ 249,90
Descrição: Ideal para gamers, com iluminação personalizável e teclas super responsivas.

5️⃣ Câmera de Segurança Wi-Fi
Preço: R$ 199,90
Descrição: Transmissão ao vivo, visão noturna e acesso remoto via app.

👉 Digite o número do item para adicioná-lo ao seu carrinho ou escreva "voltar" para retornar ao menu anterior.`)
    botState = "tech_gadgets"
    return
  } else if (botState === "catalog" && message.body === "3") {
    message.reply(`*Loja Virtual*: 🏠 Casa e Decoração 🕯️

Deixe sua casa mais bonita e aconchegante com esses produtos:


1️⃣ Kit de Velas Aromáticas
Preço: R$ 89,90
Descrição: Conjunto com 3 velas de aromas diferentes, perfeitas para criar um ambiente relaxante.

2️⃣ Jogo de Cama 4 Peças - Queen
Preço: R$ 229,90
Descrição: Lençol com elástico, sobrelençol e duas fronhas, feito com algodão 100%.

3️⃣ Luminária LED de Mesa
Preço: R$ 149,90
Descrição: Design moderno com ajuste de intensidade de luz e entrada USB para recarga.

4️⃣ Quadros Decorativos - Kit com 3 Peças
Preço: R$ 199,90
Descrição: Estampas minimalistas que combinam com qualquer ambiente.

5️⃣ Tapete de Pelúcia Antiderrapante
Preço: R$ 179,90
Descrição: Ideal para salas e quartos, com toque macio e base segura.

👉 Digite o número do item para adicioná-lo ao seu carrinho ou escreva "voltar" para retornar ao menu anterior.`)
    botState = "home_decoration"
    return
  } else if (
    botState === "catalog" &&
    (message.body === "voltar" || message.body === "Voltar")
  ) {
    message.reply(`⬅ Voltando ao menu... Você está no menu!`)
    botState = "menu"
    message.reply(showMenu())
    return
  }

  // ----------------------- SHOPPING CART -----------------------
  if (botState === "shopping_cart" && message.body === "limpar") {
    message.reply(`🛒 Carrinho de compras limpo! 🧼

⬅ Voltando ao menu... Você está no menu!
    `)
    botState = "menu"
    shop_cart = []
    shop_cart_prices = []
    shop_cart_price = 0
    return
  } else if (botState === "shopping_cart" && message.body === "1") {
    message.reply(`⬅ Voltando ao menu... Você está no menu!`)
    botState = "menu"
    message.reply(showMenu())
    return
  } else if (
    botState === "shopping_cart" &&
    (message.body === "voltar" || message.body === "Voltar")
  ) {
    message.reply(`⬅ Voltando para ao menu... Você está no menu!`)
    botState = "menu"
    message.reply(showMenu())
  }

  // ----------------------- FINALIZE PURCHASE -----------------------
  if (botState === "finalize_purchase" && message.body === "1") {
    message.reply(
      `email.ficticio@pix.com.br\n\n✅ Compra realizada com sucesso!`
    )
    const timestamp = new Date().getTime()
    const formattedDate = new Date(timestamp).toLocaleString()
    console.log(
      `Purchase Made: R$${shop_cart_prices.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        shop_cart_price
      )} at ${formattedDate} `
    )
    shop_cart = []
    shop_cart_prices = []
    shop_cart_price = 0
    setTimeout(() => {
      message.reply(`⬅ Voltando para o menu... Você está no menu!`)
      botState = "menu"
      message.reply(showMenu())
    }, 3000)
    return
  } else if (botState === "finalize_purchase" && message.body === "2") {
    message.reply(`⬅ Voltando para o menu... Você está no menu!`)
    botState = "menu"
    message.reply(showMenu())
    return
  }

  // ----------------------- CATALOG 1 - CLOTHES AND ACESSORIES -----------------------
  if (botState === "clothes_accessories" && message.body === "1") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Camiseta Básica Unissex - *R$ 49,90* - Disponível em várias cores e tamanhos. Feita com algodão premium.`
    )
    shop_cart.push("Camiseta Básica Unissex - *R$ 49,90*")
    shop_cart_prices.push(49.9)
    return
  } else if (botState === "clothes_accessories" && message.body === "2") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Jaqueta Jeans Oversized - *R$ 159,90* - Um clássico atemporal, disponível nos tamanhos P, M, G e GG.`
    )
    shop_cart.push("Jaqueta Jeans Oversized - *R$ 159,90*")
    shop_cart_prices.push(159.9)
    return
  } else if (botState === "clothes_accessories" && message.body === "3") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Relógio Minimalista - *R$ 199,90* - Design moderno com pulseira de couro ajustável.`
    )
    shop_cart.push("Relógio Minimalista - *R$ 199,90*")
    shop_cart_prices.push(199.9)

    return
  } else if (botState === "clothes_accessories" && message.body === "4") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Mochila Casual - *R$ 129,90* - Espaçosa e resistente, ideal para o dia a dia.`
    )
    shop_cart.push("Mochila Casual - *R$ 129,90*")
    shop_cart_prices.push(129.9)
    return
  } else if (botState === "clothes_accessories" && message.body === "5") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Óculos de Sol Vintage - *R$ 89,90* - Estilo retrô com proteção UV400.`
    )
    shop_cart.push("Óculos de Sol Vintage - *R$ 89,90*")
    shop_cart_prices.push(89.9)
    return
  } else if (
    botState === "clothes_accessories" &&
    (message.body === "voltar" || message.body === "Voltar")
  ) {
    message.reply(`⬅ Voltando para o catálogo... Você está no catálogo!`)
    botState = "catalog"
    message.reply(showCatalog())
  }

  // ----------------------- CATALOG 2 - TEHCNOLOGY AND GADGETS -----------------------
  if (botState === "tech_gadgets" && message.body === "1") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Fone de Ouvido Bluetooth - *R$ 129,90* - Som de alta qualidade, bateria de longa duração e compatibilidade universal.`
    )
    shop_cart.push("Fone de Ouvido Bluetooth - *R$ 129,90*")
    shop_cart_prices.push(129.9)
    return
  } else if (botState === "tech_gadgets" && message.body === "2") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Carregador Portátil (Power Bank) - *R$ 179,90* - Capacidade de 20.000 mAh, ideal para recarregar seus dispositivos em qualquer lugar.`
    )
    shop_cart.push("Carregador Portátil (Power Bank) - *R$ 179,90*")
    shop_cart_prices.push(179.9)
    return
  } else if (botState === "tech_gadgets" && message.body === "3") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Smartwatch Esportivo - *R$ 299,90* - Monitoramento de atividades físicas, batimentos cardíacos e notificações do celular.`
    )
    shop_cart.push("Smartwatch Esportivo - *R$ 299,90*")
    shop_cart_prices.push(299.9)
    return
  } else if (botState === "tech_gadgets" && message.body === "4") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Teclado Mecânico RGB - *R$ 249,90* - Ideal para gamers, com iluminação personalizável e teclas super responsivas.`
    )
    shop_cart.push("Teclado Mecânico RGB - *R$ 249,90*")
    shop_cart_prices.push(249.9)
    return
  } else if (botState === "tech_gadgets" && message.body === "5") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Câmera de Segurança Wi-Fi - *R$ 199,90* - Transmissão ao vivo, visão noturna e acesso remoto via app.`
    )
    shop_cart.push("Câmera de Segurança Wi-Fi - *R$ 199,90*")
    shop_cart_prices.push(199.9)
    return
  } else if (
    botState === "tech_gadgets" &&
    (message.body === "voltar" || message.body === "Voltar")
  ) {
    message.reply(`⬅ Voltando para o catálogo... Você está no catálogo!`)
    botState = "catalog"
    message.reply(showCatalog())
  }

  // ----------------------- CATALOG 3 - HOME AND DECORATIONS -------------------------
  if (botState === "home_decoration" && message.body === "1") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Kit de Velas Aromáticas - *R$ 89,90* - Conjunto com 3 velas de aromas diferentes, perfeitas para criar um ambiente relaxante.`
    )
    shop_cart.push("Kit de Velas Aromáticas - *R$ 89,90*")
    shop_cart_prices.push(89.9)
    return
  } else if (botState === "home_decoration" && message.body === "2") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Jogo de Cama 4 Peças - Queen - *R$ 229,90* - Lençol com elástico, sobrelençol e duas fronhas, feito com algodão 100%.`
    )
    shop_cart.push("Jogo de Cama 4 Peças - Queen - *R$ 229,90*")
    shop_cart_prices.push(229.9)
    return
  } else if (botState === "home_decoration" && message.body === "3") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Luminária LED de Mesa - *R$ 149,90* - Design moderno com ajuste de intensidade de luz e entrada USB para recarga.`
    )
    shop_cart.push("Luminária LED de Mesa - *R$ 149,90*")
    shop_cart_prices.push(149.9)
    return
  } else if (botState === "home_decoration" && message.body === "4") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Quadros Decorativos - Kit com 3 Peças - *R$ 199,90* - Estampas minimalistas que combinam com qualquer ambiente.`
    )
    shop_cart.push("Quadros Decorativos - Kit com 3 Peças - *R$ 199,90*")
    shop_cart_prices.push(199.9)
    return
  } else if (botState === "home_decoration" && message.body === "5") {
    message.reply(
      `Foi adicionado ao carrinho o produto: Tapete de Pelúcia Antiderrapante - *R$ 179,90* - Ideal para salas e quartos, com toque macio e base segura.`
    )
    shop_cart.push("Tapete de Pelúcia Antiderrapante - *R$ 179,90*")
    shop_cart_prices.push(179.9)
    return
  } else if (
    botState === "home_decoration" &&
    (message.body === "voltar" || message.body === "Voltar")
  ) {
    message.reply(`⬅ Voltando para o catálogo... Você está no catálogo!`)
    botState = "catalog"
    message.reply(showCatalog())
  }

  // ----------------------- CLOSE STORE -----------------------
  if (message.body === "!fecharloja") {
    message.reply(`*Loja Virtual*: 👋 Você saiu da nossa Loja Virtual.
    
Foi um prazer ajudá-lo! Se precisar de mais alguma coisa, estamos à disposição. Volte sempre! 😊`)
    setTimeout(() => {
      process.exit()
    }, 3000)
    console.log("Store Closed!")
  }
})

client.initialize()
