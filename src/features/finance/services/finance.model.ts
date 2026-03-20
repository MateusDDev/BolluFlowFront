export type FinanceTransactionType = 'income' | 'expense'
export type FinanceTransactionSourceType =
    | 'manual'
    | 'sale'
    | 'ingredient_purchase'
    | 'supply_purchase'
    | 'fixed_cost'

export interface FinancialTransactionModel {
    id: string
    type: FinanceTransactionType
    sourceType: FinanceTransactionSourceType
    description: string
    amount: number
    eventDate: string
    month: string
    notes?: string
    sourceEntityType: 'sale' | 'purchase' | 'fixed_cost' | 'manual'
    sourceEntityId?: string
    isAutomatic: boolean
    metadata?: Record<string, unknown>
}

export interface FinanceOverviewModel {
    month: string
    incomeTotal: number
    expenseTotal: number
    monthBalance: number
    projectedBalance: number
    recentTransactions: FinancialTransactionModel[]
}

export interface FixedCostModel {
    id: string
    name: string
    amount: number
    startMonth: string
    endMonth?: string | null
    notes?: string
    createdAt: string
    updatedAt: string
}
