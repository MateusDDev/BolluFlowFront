import { DeliveryAddressType } from '@/shared/types/deliveryAddressType'

export interface CustomerModel {
    id: number
    userId: number
    name: string
    whatsapp: string
    deliveryAddress: DeliveryAddressType
    preferences?: string
    birthday?: Date
}
