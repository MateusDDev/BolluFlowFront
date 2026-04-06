export const TEMPLATE_VARIABLES = [
    { variable: '{nomeDoCliente}', label: 'Nome do cliente' },
    { variable: '{numeroDoPedido}', label: 'Número do pedido' },
    { variable: '{itensDoPedido}', label: 'Itens do pedido' },
    { variable: '{total}', label: 'Total' },
    { variable: '{formaDePagamento}', label: 'Forma de pagamento' },
    { variable: '{dataDeEntrega}', label: 'Data de entrega' },
    { variable: '{endereco}', label: 'Endereço' },
]

export const DEFAULT_WHATSAPP_TEMPLATE = `Olá, *{nomeDoCliente}*! 🍰

Segue o resumo do seu pedido:

📦 *Pedido #{numeroDoPedido}*
{itensDoPedido}

💰 *Total: {total}*
💳 Pagamento: {formaDePagamento}
📅 Entrega: {dataDeEntrega}
📍 {endereco}

Qualquer dúvida estou à disposição! 😊`
