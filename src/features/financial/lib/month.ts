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
