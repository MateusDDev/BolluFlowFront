import { apiClient } from '@/shared/api/client'
import {
    FinancialTransactionModel,
    FinanceOverviewModel,
    FixedCostModel,
} from '@/features/finance/services/finance.model'

export function getFinanceOverview(month: string) {
    return apiClient<FinanceOverviewModel>(
        `/api/finance/overview?month=${month}`
    )
}

export function getFinanceTransactions(month: string) {
    return apiClient<FinancialTransactionModel[]>(
        `/api/finance/transactions?month=${month}`
    )
}

export function createManualTransaction(data: {
    type: 'income' | 'expense'
    description: string
    amount: number
    eventDate: string
    notes?: string
}) {
    return apiClient<FinancialTransactionModel>(
        '/api/finance/transactions',
        'POST',
        data
    )
}

export function deleteTransaction(id: string) {
    return apiClient<{
        deleted: boolean
        cascade?: boolean
        sourceEntityType?: string
    }>(`/api/finance/transactions/${id}`, 'DELETE')
}

export function getFixedCosts() {
    return apiClient<FixedCostModel[]>('/api/finance/fixed-costs')
}

export function createFixedCost(data: {
    name: string
    amount: number
    startMonth: string
    endMonth?: string | null
    notes?: string
}) {
    return apiClient<FixedCostModel>('/api/finance/fixed-costs', 'POST', data)
}

export function updateFixedCost(
    id: string,
    data: {
        name: string
        amount: number
        startMonth: string
        endMonth?: string | null
        notes?: string
    }
) {
    return apiClient<FixedCostModel>(
        `/api/finance/fixed-costs/${id}`,
        'PUT',
        data
    )
}

export function deleteFixedCost(id: string, mode: string, month: string) {
    return apiClient<{ deleted: boolean; mode: string; month: string | null }>(
        `/api/finance/fixed-costs/${id}?mode=${mode}&month=${month}`,
        'DELETE'
    )
}

export function createInventoryPurchase(data: {
    itemType: 'ingredient' | 'supply'
    itemId?: number
    itemName: string
    conversionName: string
    quantity: number
    quantityInBaseUnit: number
    totalCost: number
    purchasedAt: string
    notes?: string
}) {
    return apiClient('/api/inventory/purchases', 'POST', data)
}
