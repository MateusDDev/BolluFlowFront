import { apiClient } from '@/shared/api/client'
import {
    DashboardStockAlertItemModel,
    ProductMarginModel,
    SalesSummaryModel,
    TodayModel,
} from '@/features/dashboard/services/dashboard.model'
import { DashboardPeriodRange } from '@/features/dashboard/helpers/periods'

export function getDashboardStockAlerts() {
    return apiClient<DashboardStockAlertItemModel[]>(
        '/dashboard/stock-alerts',
        'GET'
    )
}

export function getSalesSummary(range: DashboardPeriodRange) {
    const params = new URLSearchParams({
        from: range.from.toISOString(),
        to: range.to.toISOString(),
        previousFrom: range.previousFrom.toISOString(),
        utcOffsetMinutes: String(new Date().getTimezoneOffset()),
    })

    return apiClient<SalesSummaryModel>(`/dashboard/sales?${params}`, 'GET')
}

export function getToday(dayStart: Date) {
    const params = new URLSearchParams({ dayStart: dayStart.toISOString() })

    return apiClient<TodayModel>(`/dashboard/today?${params}`, 'GET')
}

export function getProductMargins() {
    return apiClient<ProductMarginModel[]>('/dashboard/product-margins', 'GET')
}
