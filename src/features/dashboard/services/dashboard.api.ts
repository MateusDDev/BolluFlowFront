import { apiClient } from '@/shared/api/client'
import {
    DashboardInventoryValueByTypeModel,
    DashboardOrdersByStatusItemModel,
    DashboardRecentOrderItemModel,
    DashboardStockAlertItemModel,
} from '@/features/dashboard/services/dashboard.model'

export function getDashboardStockAlerts() {
    return apiClient<DashboardStockAlertItemModel[]>(
        '/dashboard/stock-alerts',
        'GET'
    )
}

export function getDashboardOrdersByStatus() {
    return apiClient<DashboardOrdersByStatusItemModel[]>(
        '/dashboard/orders-by-status',
        'GET'
    )
}

export function getDashboardInventoryValueByType() {
    return apiClient<DashboardInventoryValueByTypeModel[]>(
        '/dashboard/inventory-value-by-type',
        'GET'
    )
}

export function getDashboardRecentOrders() {
    return apiClient<DashboardRecentOrderItemModel[]>(
        '/dashboard/recent-orders',
        'GET'
    )
}
