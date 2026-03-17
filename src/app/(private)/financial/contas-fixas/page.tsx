import { FinancialFixedCostsContainer } from '@/features/financial/containers/FinancialFixedCostsContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export default async function FinancialFixedCostsPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const params = await searchParams
    const month = params.month ?? getCurrentMonthValue()

    return <FinancialFixedCostsContainer month={month} />
}
