import { FinancialSummaryContainer } from '@/features/financial/containers/FinancialSummaryContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export default async function FinancialSummaryPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const params = await searchParams
    const month = params.month ?? getCurrentMonthValue()

    return <FinancialSummaryContainer month={month} />
}
