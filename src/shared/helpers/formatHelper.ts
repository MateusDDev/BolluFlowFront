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

export function formatCurrencyInput(
    value: string,
    locale = 'pt-BR',
    currency = 'BRL'
) {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''

    const number = Number(digits) / 100

    return new Intl.NumberFormat(locale, {
        style: currency ? 'currency' : 'decimal',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number)
}

export function formatCurrencyDisplay(
    value: string | number,
    locale = 'pt-BR',
    currency = 'BRL'
) {
    const number =
        typeof value === 'number'
            ? value
            : Number(value.toString().replace(',', '.'))

    if (isNaN(number)) return ''

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number)
}

export function formatQuantityInput(value: string) {
    let formatted = value.replace(/[^\d,]/g, '')

    const parts = formatted.split(',')
    if (parts.length > 2) {
        formatted = parts[0] + ',' + parts.slice(1).join('')
    }

    if (parts[1]) {
        formatted = parts[0] + ',' + parts[1].slice(0, 2)
    }

    return formatted
}

export function formatQuantityDisplay(value: number) {
    if (value == null) return ''
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
}
