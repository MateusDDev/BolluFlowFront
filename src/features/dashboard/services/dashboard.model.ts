import { OrderStatus } from '@/features/orders/services/order.model'

export interface DashboardStockAlertItemModel {
    id: number
    name: string
    category: 'Product' | 'Ingredient' | 'Supply'
    baseUnit: string
    stockQuantity: number
    minimumStockQuantity: number
    stockCoveragePercent: number
    severity: 'Critical' | 'Warning'
}

export interface SalesPeriodMetricsModel {
    revenue: number
    salesCount: number
    averageTicket: number
    grossProfit: number
    margin: number | null
}

export interface MonthlySalesModel {
    year: number
    month: number
    revenue: number
    salesCount: number
}

export interface TopProductModel {
    productId: number
    name: string
    quantity: number
    revenue: number
}

export interface SalesSummaryModel {
    current: SalesPeriodMetricsModel
    previous: SalesPeriodMetricsModel
    monthly: MonthlySalesModel[]
    topProducts: TopProductModel[]
    hasCostData: boolean
}

export interface TodayOrderModel {
    id: number
    number: number
    customerName: string | null
    status: OrderStatus
    deliveryDate: string | null
    total: number
}

export interface TodayModel {
    overdue: TodayOrderModel[]
    dueToday: TodayOrderModel[]
    dueTomorrow: TodayOrderModel[]
    ready: TodayOrderModel[]
}

export interface ProductMarginModel {
    id: number
    name: string
    price: number
    cost: number
    margin: number | null
    hasRecipe: boolean
}
