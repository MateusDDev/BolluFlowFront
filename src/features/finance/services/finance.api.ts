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

export function getFinancialEntries(type?: FinancialEntryType) {
    const queryString = type ? `?type=${type}` : ''

    return apiClient<FinancialEntryModel[]>(`/financial/entries${queryString}`, 'GET')
}

export function getFinancialBalance() {
    return apiClient<FinancialBalanceModel>('/financial/balance', 'GET')
}
