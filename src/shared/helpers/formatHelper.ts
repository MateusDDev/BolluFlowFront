export function formatWhatsapp(value: string) {
    const digits = value.replace(/\D/g, '')

    if (!digits) return ''

    if (digits.length <= 2) return `(${digits}`

    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export function formatDate(date?: Date | string): string {
    if (!date) return ''

    const parsedDate = typeof date === 'string' ? new Date(date) : date

    return new Intl.DateTimeFormat('pt-BR').format(parsedDate)
}
