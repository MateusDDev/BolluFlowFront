import {
    buildFixedCostTransactions,
    FinancialTransaction,
    FixedCost,
    listMonthsBetween,
    readFinanceDatabase,
} from '@/shared/server/finance-store'

export async function getExpandedTransactions(targetMonth?: string) {
    const database = await readFinanceDatabase()
    const manualTransactions = database.transactions.filter(
        (item) => !item.deletedAt
    )
    const fixedCosts = database.fixedCosts.filter((item) => !item.deletedAt)

    if (!targetMonth) {
        const months = Array.from(
            new Set([
                ...manualTransactions.map((item) => item.month),
                ...fixedCosts.map((item) => item.startMonth),
            ])
        ).sort()

        const latestMonth =
            months[months.length - 1] ?? new Date().toISOString().slice(0, 7)
        const generatedFixedCosts = buildFixedCostTransactions(
            fixedCosts,
            latestMonth
        )
        return [...manualTransactions, ...generatedFixedCosts]
    }

    const generatedFixedCosts = buildFixedCostTransactions(
        fixedCosts,
        targetMonth
    )

    return [
        ...manualTransactions.filter((item) => item.month === targetMonth),
        ...generatedFixedCosts,
    ]
}

export function summarizeTransactions(transactions: FinancialTransaction[]) {
    const incomeTotal = transactions
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0)

    const expenseTotal = transactions
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0)

    return {
        incomeTotal,
        expenseTotal,
        monthBalance: incomeTotal - expenseTotal,
    }
}

export function calculateProjectedBalance(
    transactions: FinancialTransaction[],
    fixedCosts: FixedCost[],
    targetMonth: string
) {
    const monthsWithData = Array.from(
        new Set([
            ...transactions.map((item) => item.month),
            ...fixedCosts.map((item) => item.startMonth),
            targetMonth,
        ])
    ).sort()

    const firstMonth = monthsWithData[0] ?? targetMonth
    const expandedMonths = listMonthsBetween(firstMonth, targetMonth)

    return expandedMonths.reduce((runningTotal, month) => {
        const monthTransactions = transactions.filter(
            (item) => item.month === month
        )
        const fixedCostTransactions = buildFixedCostTransactions(
            fixedCosts,
            month
        )
        const monthTotal = summarizeTransactions([
            ...monthTransactions,
            ...fixedCostTransactions,
        ]).monthBalance

        return runningTotal + monthTotal
    }, 0)
}
