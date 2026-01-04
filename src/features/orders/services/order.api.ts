import { apiClient } from '@/shared/api/client'
import {
    OrderItemModel,
    OrderModel,
} from '@/features/orders/services/order.model'

export function getOrders() {
    return apiClient<OrderModel[]>('/orders', 'GET')
}

export function getOrderById(id: number) {
    return apiClient<OrderModel>(`/orders/${id}`, 'GET')
}

export function getOrderItems(id: number) {
    return apiClient<OrderItemModel[]>(`/orders/${id}/items`, 'GET')
}

export type CreateOrderItemDataType = {
    recipeId: number
    quantity: number
}

export function createOrderItem(
    orderId: number,
    data: CreateOrderItemDataType[]
) {
    return apiClient(`/orders/${orderId}/items`, 'POST', data)
}

export type UpdateOrderItemDataType = {
    quantity: number
    unitPrice: number
}

export function updateOrderItem(
    orderId: number,
    itemId: number,
    data: UpdateOrderItemDataType
) {
    return apiClient(`/orders/${orderId}/items/${itemId}`, 'PUT', data)
}

export function deleteOrderItem(orderId: number, itemId: number) {
    return apiClient(`/orders/${orderId}/items/${itemId}`, 'DELETE')
}

export type CreateOrderDataType = {
    customerId: number
    notes?: string
    deliveryDate?: Date
}

export function createOrder(data: CreateOrderDataType) {
    return apiClient<OrderModel>('/orders', 'POST', data)
}
