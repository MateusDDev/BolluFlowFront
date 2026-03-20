'use client'

import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'
import { FinancialSummaryContainer } from '@/features/financial/containers/FinancialSummaryContainer'
import { useFinancialMonthParam } from '@/features/financial/hooks/useFinancialMonthParam'

export function FinancialSummaryPageContent() {
    const month = useFinancialMonthParam()

    return (
        <div className="space-y-4">
            <FinancialSectionHeader
                title="Resumo financeiro"
                description="Visão geral de entradas, despesas e saldo acumulado da linha do tempo financeira."
            />
            <FinancialSummaryContainer month={month} />
        </div>
    )
}
