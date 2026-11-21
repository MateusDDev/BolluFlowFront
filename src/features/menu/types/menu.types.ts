import { PaymentMethod } from '@/features/orders/services/order.model'

export interface PublicMenuModel {
    name: string
    slug?: string
    description?: string | null
    whatsapp?: string | null
    deliveryTimeMinutes?: number | null
    pixKey?: string | null
    storeAddress?: MenuStoreAddress | null
}

export interface MenuStoreAddress {
    street: string
    number: number
    neighborhood: string
    complement: string | null
}

export interface PublicMenuProductModel {
    id: number
    name: string
    category?: string | null
    description: string | null
    finalPrice?: number
    salePrice?: number
    price?: number
    imageUrl: string | null
    isAvailable?: boolean
}

export interface CartItem {
    productId: number
    productName: string
    unitPrice: number
    quantity: number
}

export interface CreatePublicOrderItemDataType {
    productId: number
    quantity: number
}

export interface CreatePublicOrderDataType {
    customerName: string
    customerWhatsapp: string
    customerStreet?: string
    customerNumber?: string
    customerNeighborhood?: string
    customerComplement?: string
    isPickup: boolean
    note?: string
    paymentMethod: PaymentMethod
    changeFor?: number
    items: CreatePublicOrderItemDataType[]
}

export interface PublicOrderConfirmationModel {
    orderId: number
    orderNumber: number
}

export interface CompletedMenuOrder {
    orderNumber: number
    paymentMethod: PaymentMethod
    isPickup: boolean
    whatsappUrl: string | null
}

export interface CustomerLookupResponse {
    exists: boolean
}

export interface StoredCustomer {
    name: string
    whatsapp: string
    street: string
    number: number
    neighborhood: string
    complement?: string
}

export interface OrderFormState {
    customerName: string
    customerWhatsapp: string
    customerStreet: string
    customerNumber: string
    customerNeighborhood: string
    customerComplement: string
    isPickup: boolean
    note: string
    paymentMethod: PaymentMethod | null
    changeFor: string
}

export interface ProductCategoryGroup {
    title: string
    products: PublicMenuProductModel[]
    isOther: boolean
}
