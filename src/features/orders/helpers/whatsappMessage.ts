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
    totalValue?: number
}

export function buildOrderWhatsappMessage(
    order: OrderWhatsappMessageModel
): string {
    const lines: string[] = []

    const items = order.items ?? []
    const computedTotal =
        order.totalValue ??
        items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

    lines.push(`Olá, *${order.customer.name}*! 🍰`)
    lines.push('')
    lines.push('Segue o resumo do seu pedido:')
    lines.push('')
    lines.push(`📦 *Pedido #${order.number}*`)

    for (const item of items) {
        lines.push(`• ${item.product.name} x${item.quantity}`)
    }

    lines.push('')
    lines.push(`💰 *Total: ${formatCurrency(computedTotal)}*`)

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
