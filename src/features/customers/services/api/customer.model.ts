import { DeliveryAddressType } from '@/shared/types/deliveryAddressType'

export interface CustomerModel {
    id: number
    userId: number
    name: string
    whatsapp: string
    deliveryAddress: DeliveryAddressType | null
    preferences?: string
    birthday?: Date
}
