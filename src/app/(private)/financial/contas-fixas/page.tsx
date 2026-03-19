import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'
import { FinancialFixedCostsContainer } from '@/features/financial/containers/FinancialFixedCostsContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export default async function FinancialFixedCostsPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const params = await searchParams
    const month = params.month ?? getCurrentMonthValue()

    return (
        <div className="space-y-4">
            <FinancialSectionHeader
                title="Contas fixas"
                description="Acompanhe custos recorrentes e o impacto mensal no caixa."
            />
            <FinancialFixedCostsContainer month={month} />
        </div>
    )
}
