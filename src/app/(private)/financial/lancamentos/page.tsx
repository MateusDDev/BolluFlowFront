import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'
import { FinancialEntriesContainer } from '@/features/financial/containers/FinancialEntriesContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export default async function FinancialEntriesPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const params = await searchParams
    const month = params.month ?? getCurrentMonthValue()

    return (
        <div className="space-y-4">
            <FinancialSectionHeader
                title="Lançamentos"
                description="Gerencie entradas e despesas do mês, incluindo lançamentos manuais."
            />
            <FinancialEntriesContainer month={month} />
        </div>
    )
}
