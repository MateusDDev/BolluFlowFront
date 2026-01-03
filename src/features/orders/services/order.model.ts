export type OrderStatus =
    | 'Pending'
    | 'InProduction'
    | 'Ready'
    | 'Delivered'
    | 'Canceled'

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
    createdAt: Date
    deliveryDate?: Date
}
