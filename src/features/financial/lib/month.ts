export function getCurrentMonthValue() {
    return new Date().toISOString().slice(0, 7)
}

export function getMonthLabel(month: string) {
    const [year, monthIndex] = month.split('-').map(Number)

    return new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(year, monthIndex - 1, 1))
}

export function compareMonth(a: string, b: string) {
    return a.localeCompare(b)
}

export function getMonthFromDate(date: Date) {
    return date.toISOString().slice(0, 7)
}

export function addMonths(month: string, amount: number) {
    const [year, monthIndex] = month.split('-').map(Number)
    const date = new Date(year, monthIndex - 1 + amount, 1)

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthsBetween(startMonth: string, endMonth: string) {
    const months: string[] = []
    let cursor = startMonth

    while (compareMonth(cursor, endMonth) <= 0) {
        months.push(cursor)
        cursor = addMonths(cursor, 1)
    }

    return months
}
