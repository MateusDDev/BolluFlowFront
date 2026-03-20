'use client'

import { useState } from 'react'
import { getCurrentMonthValue } from '@/features/finance/services/finance.utils'
import { FinanceOverviewContainer } from '@/features/finance/containers/FinanceOverviewContainer'
import { FinanceTransactionsContainer } from '@/features/finance/containers/FinanceTransactionsContainer'
import { FinanceFixedCostsContainer } from '@/features/finance/containers/FinanceFixedCostsContainer'

export function FinanceOverviewPageState() {
    const [month, setMonth] = useState(getCurrentMonthValue())
    return <FinanceOverviewContainer month={month} onMonthChange={setMonth} />
}

export function FinanceTransactionsPageState() {
    const [month, setMonth] = useState(getCurrentMonthValue())
    return (
        <FinanceTransactionsContainer month={month} onMonthChange={setMonth} />
    )
}

export function FinanceFixedCostsPageState() {
    const [month, setMonth] = useState(getCurrentMonthValue())
    return <FinanceFixedCostsContainer month={month} onMonthChange={setMonth} />
}
