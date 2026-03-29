import { apiClient } from '@/shared/api/client'
import {
    CreateFinancialEntryDataType,
    FinancialBalanceModel,
    FinancialEntryModel,
    FinancialEntryType,
} from '@/features/finance/services/finance.model'

export function createFinancialEntry(data: CreateFinancialEntryDataType) {
    return apiClient<FinancialEntryModel>('/financeiro/lancamentos', 'POST', data)
}

export function getFinancialEntries(type?: FinancialEntryType) {
    const queryString = type ? `?tipo=${type}` : ''

    return apiClient<FinancialEntryModel[]>(
        `/financeiro/lancamentos${queryString}`,
        'GET'
    )
}

export function getFinancialBalance() {
    return apiClient<FinancialBalanceModel>('/financeiro/saldo', 'GET')
}
