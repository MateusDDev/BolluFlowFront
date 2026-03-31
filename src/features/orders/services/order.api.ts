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
    productId: number
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
    paymentMethod?: 'Cash' | 'Pix' | 'CreditCard' | 'DebitCard' | null
}

export function createOrder(data: CreateOrderDataType) {
    return apiClient<OrderModel>('/orders', 'POST', data)
}

export type UpdateOrderDataType = {
    note?: string
    deliveryDate?: Date
    customerId?: number
    paymentMethod?: 'Cash' | 'Pix' | 'CreditCard' | 'DebitCard' | null
}

export function updateOrder(id: number, data: UpdateOrderDataType) {
    return apiClient(`/orders/${id}`, 'PUT', data)
}

export function cancelOrder(id: number, revertStock?: boolean) {
    const query =
        revertStock === undefined ? '' : `?revertStock=${String(revertStock)}`
    return apiClient(`/orders/${id}/cancel${query}`, 'POST')
}

export function deliverOrder(id: number) {
    return apiClient(`/orders/${id}/deliver`, 'POST')
}

export function startProductionOrder(id: number) {
    return apiClient(`/orders/${id}/start`, 'POST')
}

export function finishProductionOrder(id: number) {
    return apiClient(`/orders/${id}/finish`, 'POST')
}

export function reopenOrder(id: number) {
    return apiClient(`/orders/${id}/reopen`, 'POST')
}

export function openOrderReport(orderId: number) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/order/${orderId}`

    window.open(url, '_blank')
}
