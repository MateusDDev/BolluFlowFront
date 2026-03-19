import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'
import { FinancialSummaryContainer } from '@/features/financial/containers/FinancialSummaryContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export default async function FinancialSummaryPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const params = await searchParams
    const month = params.month ?? getCurrentMonthValue()

    return (
        <div className="space-y-4">
            <FinancialSectionHeader
                title="Resumo financeiro"
                description="Visão geral simples de entradas, despesas e saldo do mês."
            />
            <FinancialSummaryContainer month={month} />
        </div>
    )
}
