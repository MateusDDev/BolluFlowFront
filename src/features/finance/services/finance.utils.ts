import { formatCurrency } from '@/shared/helpers/formatHelper'
import { FinanceTransactionSourceType } from '@/features/finance/services/finance.model'

export function getCurrentMonthValue() {
    return new Date().toISOString().slice(0, 7)
}

export function formatMonthLabel(month: string) {
    return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    })
}

export function formatFinanceCurrency(value: number) {
    return formatCurrency(value, 'pt-BR', 'BRL')
}

export function getSourceLabel(sourceType: FinanceTransactionSourceType) {
    const labelMap: Record<FinanceTransactionSourceType, string> = {
        manual: 'Manual',
        sale: 'Venda',
        ingredient_purchase: 'Compra de ingrediente',
        supply_purchase: 'Compra de insumo',
        fixed_cost: 'Conta fixa',
    }

    return labelMap[sourceType]
}

export function getTransactionTypeLabel(type: 'income' | 'expense') {
    return type === 'income' ? 'Entrada' : 'Despesa'
}
