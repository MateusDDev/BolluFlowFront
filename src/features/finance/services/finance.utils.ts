import { formatCurrency } from '@/shared/helpers/formatHelper'
import { FinanceTransactionSourceType } from '@/features/finance/services/finance.model'

export function getCurrentMonthValue() {
    return new Date().toISOString().slice(0, 7)
}

export function formatMonthLabel(month: string) {
    return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    })
}

export function formatFinanceCurrency(value: number) {
    return formatCurrency(value, 'en-US', 'USD')
}

export function getSourceLabel(sourceType: FinanceTransactionSourceType) {
    const labelMap: Record<FinanceTransactionSourceType, string> = {
        manual: 'Manual',
        sale: 'Sale',
        ingredient_purchase: 'Ingredient purchase',
        supply_purchase: 'Supply purchase',
        fixed_cost: 'Fixed cost',
    }

    return labelMap[sourceType]
}
