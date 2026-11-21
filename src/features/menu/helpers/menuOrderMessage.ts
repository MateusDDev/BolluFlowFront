import {
    formatCurrency,
    getPaymentMethodLabel,
} from '@/shared/helpers/formatHelper'
import { CartItem } from '@/features/menu/types/menu.types'

type MenuOrderMessageData = {
    storeName: string
    orderNumber: number
    customerName: string
    items: CartItem[]
    total: number
    paymentMethod: string
    changeFor?: number
    address: string | null
    note?: string
}

export function buildMenuOrderMessage(data: MenuOrderMessageData): string {
    const lines = [
        `Olá, ${data.storeName}! Acabei de fazer o pedido #${data.orderNumber} pelo cardápio.`,
        '',
        '*Itens*',
        ...data.items.map(
            (item) =>
                `${item.quantity}x ${item.productName} — ${formatCurrency(item.quantity * item.unitPrice)}`
        ),
        '',
        `*Total:* ${formatCurrency(data.total)}`,
        `*Pagamento:* ${getPaymentMethodLabel(data.paymentMethod)}${data.changeFor ? ` (troco para ${formatCurrency(data.changeFor)})` : ''}`,
        '',
        `*Nome:* ${data.customerName}`,
        data.address ? `*Entrega:* ${data.address}` : '*Retirada na doceria*',
    ]

    if (data.note) lines.push(`*Observação:* ${data.note}`)

    return lines.join('\n')
}
