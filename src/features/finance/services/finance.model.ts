export type FinancialEntryType = 'income' | 'expense'

export type FinancialEntryOrigin =
    | 'order'
    | 'supply_purchase'
    | 'ingredient_purchase'
    | 'manual'

export interface FinancialEntryModel {
    id: number
    type: FinancialEntryType
    amount: number
    description: string
    origin: FinancialEntryOrigin
    originId?: number | null
    createdAt: string
}

export interface FinancialBalanceModel {
    monthIncome: number
    monthExpenses: number
    totalIncome: number
    totalExpenses: number
    balance: number
}

export interface CreateFinancialEntryDataType {
    type: FinancialEntryType
    amount: number
    description: string
}
