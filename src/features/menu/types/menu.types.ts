export interface PublicMenuModel {
    name: string
    slug?: string
    description?: string | null
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
    customerStreet: string
    customerNumber: string
    customerNeighborhood: string
    note?: string
    items: CreatePublicOrderItemDataType[]
}

export interface PublicOrderConfirmationModel {
    id: number
    number?: number
    orderNumber?: number
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
}

export interface OrderFormState {
    customerName: string
    customerWhatsapp: string
    customerStreet: string
    customerNumber: string
    customerNeighborhood: string
    note: string
}

export interface ProductCategoryGroup {
    title: string
    products: PublicMenuProductModel[]
    isOther: boolean
}
