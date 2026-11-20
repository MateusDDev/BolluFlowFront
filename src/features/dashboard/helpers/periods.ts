export type DashboardPeriod = 'month' | 'last30' | 'year'

export type DashboardPeriodRange = {
    from: Date
    to: Date
    previousFrom: Date
    comparisonLabel: string
}

export const DASHBOARD_PERIOD_LABELS: Record<DashboardPeriod, string> = {
    month: 'Este mês',
    last30: 'Últimos 30 dias',
    year: 'Este ano',
}

export function startOfLocalDay(date: Date = new Date()) {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
}

export function getPeriodRange(
    period: DashboardPeriod,
    now: Date = new Date()
): DashboardPeriodRange {
    const tomorrow = startOfLocalDay(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (period === 'month') {
        const from = new Date(now.getFullYear(), now.getMonth(), 1)
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const previousFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return { from, to, previousFrom, comparisonLabel: 'mês passado' }
    }

    if (period === 'year') {
        const from = new Date(now.getFullYear(), 0, 1)
        const to = new Date(now.getFullYear() + 1, 0, 1)
        const previousFrom = new Date(now.getFullYear() - 1, 0, 1)
        return { from, to, previousFrom, comparisonLabel: 'ano passado' }
    }

    const from = new Date(tomorrow)
    from.setDate(from.getDate() - 30)
    const previousFrom = new Date(from)
    previousFrom.setDate(previousFrom.getDate() - 30)

    return {
        from,
        to: tomorrow,
        previousFrom,
        comparisonLabel: '30 dias anteriores',
    }
}
