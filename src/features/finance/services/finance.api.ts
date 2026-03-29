import { apiClient } from '@/shared/api/client'
import {
    CreateFinancialEntryDataType,
    FinancialBalanceModel,
    FinancialEntryModel,
} from '@/features/finance/services/finance.model'

export function createFinancialEntry(data: CreateFinancialEntryDataType) {
    return apiClient<FinancialEntryModel>('/financeiro/lancamentos', 'POST', data)
}

export function getFinancialEntries() {
    return apiClient<FinancialEntryModel[]>('/financeiro/lancamentos', 'GET')
}

export function getFinancialBalance() {
    return apiClient<FinancialBalanceModel>('/financeiro/saldo', 'GET')
}
