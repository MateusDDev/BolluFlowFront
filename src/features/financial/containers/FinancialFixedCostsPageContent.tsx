'use client'

import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'
import { FinancialFixedCostsContainer } from '@/features/financial/containers/FinancialFixedCostsContainer'
import { useFinancialMonthParam } from '@/features/financial/hooks/useFinancialMonthParam'

export function FinancialFixedCostsPageContent() {
    const month = useFinancialMonthParam()

    return (
        <div className="space-y-4">
            <FinancialSectionHeader
                title="Contas fixas"
                description="Gerencie recorrências mensais com impacto contínuo e exclusão controlada por intervalo."
            />
            <FinancialFixedCostsContainer month={month} />
        </div>
    )
}
