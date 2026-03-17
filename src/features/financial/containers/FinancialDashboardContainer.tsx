'use client'

import { FinancialSummaryContainer } from '@/features/financial/containers/FinancialSummaryContainer'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

export function FinancialDashboardContainer() {
    return <FinancialSummaryContainer month={getCurrentMonthValue()} />
}
