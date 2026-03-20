import { NextRequest, NextResponse } from 'next/server'
import {
    calculateProjectedBalance,
    getExpandedTransactions,
    summarizeTransactions,
} from '@/app/api/finance/utils'
import { readFinanceDatabase } from '@/shared/server/finance-store'

export async function GET(request: NextRequest) {
    const month =
        request.nextUrl.searchParams.get('month') ??
        new Date().toISOString().slice(0, 7)
    const database = await readFinanceDatabase()
    const monthTransactions = await getExpandedTransactions(month)
    const summary = summarizeTransactions(monthTransactions)
    const projectedBalance = calculateProjectedBalance(
        database.transactions.filter((item) => !item.deletedAt),
        database.fixedCosts.filter((item) => !item.deletedAt),
        month
    )

    const recentTransactions = [...monthTransactions]
        .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
        .slice(0, 6)

    return NextResponse.json({
        month,
        ...summary,
        projectedBalance,
        recentTransactions,
    })
}
