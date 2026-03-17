import { FinancialEntriesContainer } from '@/features/financial/containers/FinancialEntriesContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export default async function FinancialEntriesPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const params = await searchParams
    const month = params.month ?? getCurrentMonthValue()

    return <FinancialEntriesContainer month={month} />
}
