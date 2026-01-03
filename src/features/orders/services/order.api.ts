import { apiClient } from '@/shared/api/client'
import { OrderModel } from '@/features/orders/services/order.model'

export function getOrders() {
    return apiClient<OrderModel[]>('/orders', 'GET')
}

export type CreateOrderDataType = {
    customerId: number
    notes?: string
    deliveryDate?: Date
}

export function createOrder(data: CreateOrderDataType) {
    return apiClient<OrderModel>('/orders', 'POST', data)
}
