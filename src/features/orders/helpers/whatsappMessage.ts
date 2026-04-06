import {
    OrderItemModel,
    OrderModel,
} from '@/features/orders/services/order.model'
import {
    formatCurrency,
    formatDate,
    getPaymentMethodLabel,
} from '@/shared/helpers/formatHelper'

export type OrderWhatsappMessageModel = OrderModel & {
    items?: OrderItemModel[]
}

function formatOrderItems(items: OrderItemModel[]): string {
    if (!items.length) return ''

    return items
        .map((item) => `• ${item.product.name} x${item.quantity}`)
        .join('\n')
}

function formatDeliveryAddress(order: OrderModel): string {
    const deliveryAddress = order.customer.deliveryAddress

    if (!deliveryAddress) return ''

    return `${deliveryAddress.street}, ${deliveryAddress.number} — ${deliveryAddress.neighborhood}`
}

export function applyWhatsappTemplate(
    template: string,
    order: OrderModel,
    orderItems?: OrderItemModel[]
): string {
    const replacements: Record<string, string> = {
        '{nomeDoCliente}': order.customer?.name ?? '',
        '{numeroDoPedido}': String(order.number),
        '{itensDoPedido}': formatOrderItems(orderItems ?? []),
        '{total}': formatCurrency(order.total),
        '{formaDePagamento}': order.paymentMethod
            ? getPaymentMethodLabel(order.paymentMethod)
            : '',
        '{dataDeEntrega}': order.deliveryDate
            ? formatDate(order.deliveryDate)
            : '',
        '{endereco}': formatDeliveryAddress(order),
    }

    let result = template

    for (const [variable, value] of Object.entries(replacements)) {
        result = result.replaceAll(variable, value)
    }

    result = result
        .split('\n')
        .filter((line) => !line.match(/:\s*$/))
        .join('\n')

    result = result.replace(/\n{3,}/g, '\n\n')

    return result.trim()
}

export function buildOrderWhatsappMessage(
    order: OrderWhatsappMessageModel
): string {
    const lines: string[] = []

    const items = order.items ?? []
    lines.push(`Olá, *${order.customer.name}*! 🍰`)
    lines.push('')
    lines.push('Segue o resumo do seu pedido:')
    lines.push('')
    lines.push(`📦 *Pedido #${order.number}*`)

    for (const item of items) {
        lines.push(`• ${item.product.name} x${item.quantity}`)
    }

    lines.push('')
    lines.push(`💰 *Total: ${formatCurrency(order.total)}*`)

    if (order.shippingFee > 0) {
        lines.push(`🚚 Frete: ${formatCurrency(order.shippingFee)}`)
    }

    if (order.discountValue > 0) {
        lines.push(`🏷️ Desconto: -${formatCurrency(order.discountValue)}`)
    }

    if (order.paymentMethod) {
        lines.push(
            `💳 Pagamento: ${getPaymentMethodLabel(order.paymentMethod)}`
        )
    }

    if (order.deliveryDate) {
        lines.push(`📅 Entrega: ${formatDate(order.deliveryDate)}`)
    }

    if (order.customer.deliveryAddress) {
        const { street, number, neighborhood } = order.customer.deliveryAddress
        lines.push(`📍 ${street}, ${number} — ${neighborhood}`)
    }

    if (order.note) {
        lines.push('')
        lines.push(`OBS: ${order.note}`)
    }

    lines.push('')
    lines.push('Qualquer dúvida estou à disposição!')

    return lines.join('\n')
}

export function openWhatsapp(whatsapp: string, message: string): void {
    const phone = whatsapp.replace(/\D/g, '')
    const fullPhone = phone.startsWith('55') ? phone : `55${phone}`
    const encoded = encodeURIComponent(message)

    window.open(`https://wa.me/${fullPhone}?text=${encoded}`, '_blank')
}
