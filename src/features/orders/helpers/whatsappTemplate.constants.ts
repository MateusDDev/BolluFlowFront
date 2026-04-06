export const TEMPLATE_KEYS = {
    CUSTOMER_NAME: '{Nome do cliente}',
    ORDER_NUMBER: '{Número do pedido}',
    ORDER_ITEMS: '{Itens do pedido}',
    TOTAL: '{Total}',
    PAYMENT_METHOD: '{Método de pagamento}',
    DELIVERY_DATE: '{Data de entrega}',
    ADDRESS: '{Endereço}',
}

export const TEMPLATE_VARIABLES = [
    { variable: TEMPLATE_KEYS.CUSTOMER_NAME, label: 'Nome do cliente' },
    { variable: TEMPLATE_KEYS.ORDER_NUMBER, label: 'Número do pedido' },
    { variable: TEMPLATE_KEYS.ORDER_ITEMS, label: 'Itens do pedido' },
    { variable: TEMPLATE_KEYS.TOTAL, label: 'Total' },
    { variable: TEMPLATE_KEYS.PAYMENT_METHOD, label: 'Forma de pagamento' },
    { variable: TEMPLATE_KEYS.DELIVERY_DATE, label: 'Data de entrega' },
    { variable: TEMPLATE_KEYS.ADDRESS, label: 'Endereço' },
]

export const DEFAULT_WHATSAPP_TEMPLATE = `Olá, *{nomeDoCliente}*!

Segue o resumo do seu pedido:

*Pedido #{Número do pedido*
{Itens do pedido}

*Total: {Total}*
Pagamento: {Forma de pagamento}
Entrega: {Data de entrega}
{Endereço}

Qualquer dúvida estou à disposição!`
