export type OrderStatus =
    | 'Pending'
    | 'InProduction'
    | 'Ready'
    | 'Delivered'
    | 'Canceled'

export type PaymentMethod = 'Cash' | 'Pix' | 'CreditCard' | 'DebitCard'

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
}

interface CustomerModel {
    id: number
    userId: number
    name: string
    whatsapp: string
    preferences: string
    birthday: Date
    deliveryAddress: CustomerDeliveryAddress
}

export interface OrderModel {
    id: number
    number: number
    customer: CustomerModel
    status: OrderStatus
    note: string
    paymentMethod?: PaymentMethod | null
    createdAt: Date
    deliveryDate?: Date
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
