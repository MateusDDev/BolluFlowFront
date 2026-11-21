export type OrderStatus =
    | 'Pending'
    | 'InProduction'
    | 'Ready'
    | 'Delivered'
    | 'Canceled'

export type PaymentMethod = 'Cash' | 'Pix' | 'CreditCard' | 'DebitCard'

export type OrderType = 'CustomOrder' | 'DirectSale'

export function isDirectSale(order: { type: OrderType }) {
    return order.type === 'DirectSale'
}

export const orderStatusLabelMap: Record<OrderStatus, string> = {
    Pending: 'Pendente',
    InProduction: 'Em preparo',
    Delivered: 'Entregue',
    Canceled: 'Cancelado',
    Ready: 'Pronto',
}

export const orderStatusVariantMap: Record<
    OrderStatus,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Pending: 'secondary',
    InProduction: 'outline',
    Delivered: 'default',
    Canceled: 'destructive',
    Ready: 'default',
}

interface CustomerDeliveryAddress {
    id: number
    street: string
    number: number
    neighborhood: string
    complement?: string | null
}

interface CustomerModel {
    id: number
    userId: number
    name: string
    whatsapp: string
    preferences: string
    birthday: Date
    deliveryAddress: CustomerDeliveryAddress | null
}

export interface OrderModel {
    id: number
    number: number
    customer: CustomerModel | null
    status: OrderStatus
    note: string
    paymentMethod?: PaymentMethod | null
    subtotal: number
    discount?: number | null
    discountType?: 'Percentage' | 'Fixed' | null
    discountValue: number
    shippingFee: number
    changeFor?: number | null
    isPickup?: boolean
    total: number
    createdAt: Date
    deliveryDate?: Date
    type: OrderType
    deliveredAt?: Date | null
}

interface OrderItemProductModel {
    id: number
    name: string
}

export interface OrderItemModel {
    id: number
    orderId: number
    product: OrderItemProductModel
    quantity: number
    unitPrice: number
    totalPrice: number
}
