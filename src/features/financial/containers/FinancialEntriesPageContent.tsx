'use client'

import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'
import { FinancialEntriesContainer } from '@/features/financial/containers/FinancialEntriesContainer'
import { useFinancialMonthParam } from '@/features/financial/hooks/useFinancialMonthParam'

export function FinancialEntriesPageContent() {
    const month = useFinancialMonthParam()

    return (
        <div className="space-y-4">
            <FinancialSectionHeader
                title="Lançamentos financeiros"
                description="Cadastre movimentações manuais e acompanhe entradas automáticas com origem rastreável."
            />
            <FinancialEntriesContainer month={month} />
        </div>
    )
}
