import { OrderStatus } from '@/features/orders/services/order.model'

export interface DashboardStockAlertItemModel {
    id: number
    name: string
    category: 'Product' | 'Ingredient' | 'Supply'
    baseUnit?: string | number
    stockQuantity: number
    minimumStockQuantity: number
    stockCoveragePercent: number
    severity: 'Critical' | 'Warning'
}

export interface DashboardOrdersByStatusItemModel {
    status: OrderStatus
    total: number
}

export interface DashboardInventoryValueByTypeModel {
    type: 'Products' | 'Ingredients' | 'Supplies'
    totalValue: number
}

export interface DashboardRecentOrderItemModel {
    id: number
    number: number
    customerName: string
    status: OrderStatus
    createdAt: string
    totalItems: number
    totalValue: number
}
