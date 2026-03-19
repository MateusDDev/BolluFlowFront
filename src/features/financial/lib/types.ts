export type FinancialEntryType = 'income' | 'expense'
export type FinancialEntryStatus = 'paid' | 'pending'
export type FinancialEntrySource =
    | 'auto-order'
    | 'manual'
    | 'auto-stock'
    | 'auto-fixed'

export type FinancialEntry = {
    id: string
    description: string
    type: FinancialEntryType
    category: string
    amount: number
    date: Date
    status: FinancialEntryStatus
    isFixed: boolean
    source: FinancialEntrySource
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

export type FixedAccountTemplate = {
    id: string
    description: string
    category: string
    amount: number
    startMonth: string
    endMonth?: string | null
    defaultStatus: FinancialEntryStatus
}
