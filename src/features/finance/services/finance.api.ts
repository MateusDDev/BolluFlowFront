import { apiClient } from '@/shared/api/client'
import {
    CreateFinancialEntryDataType,
    FinancialBalanceModel,
    FinancialEntryModel,
    FinancialEntryType,
} from '@/features/finance/services/finance.model'

export function createFinancialEntry(data: CreateFinancialEntryDataType) {
    return apiClient<FinancialEntryModel>('/financial/entries', 'POST', data)
}

export function getFinancialEntries(
    month: number,
    year: number,
    type?: FinancialEntryType
) {
    const params = new URLSearchParams({
        month: String(month),
        year: String(year),
        ...(type ? { type } : {}),
    })

    return apiClient<FinancialEntryModel[]>(`/financial/entries?${params}`, 'GET')
}

export function getFinancialBalance(month: number, year: number) {
    const params = new URLSearchParams({
        month: String(month),
        year: String(year),
    })

    return apiClient<FinancialBalanceModel>(`/financial/balance?${params}`, 'GET')
}
