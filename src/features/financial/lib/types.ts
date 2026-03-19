export type FinancialEntryType = 'income' | 'expense'
export type FinancialEntryStatus = 'paid' | 'pending'

export type FinancialEntry = {
    id: string
    description: string
    type: FinancialEntryType
    category: string
    amount: number
    date: Date
    status: FinancialEntryStatus
    isFixed: boolean
    source: 'auto-order' | 'manual' | 'auto-stock'
    reference?: string
}

export type CreateFinancialEntryInput = {
    description: string
    type: FinancialEntryType
    category: string
    amount: number
    date: string
    status: FinancialEntryStatus
    isFixed: boolean
}
