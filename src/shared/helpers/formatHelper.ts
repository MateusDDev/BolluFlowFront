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

export function formatCurrency(
    value: number,
    locale: string = 'pt-BR',
    currency: string = 'BRL'
) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(value)
}

export function formatCurrencyFromInput(
    value: string,
    locale = 'pt-BR',
    currency = 'BRL'
) {
    const digits = value.replace(/\D/g, '')
    const number = Number(digits) / 100

    if (Number.isNaN(number)) return ''

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
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

export function getPaymentMethodLabel(method?: string | null): string {
    switch (method) {
        case 'Cash':
            return 'Dinheiro'
        case 'Pix':
            return 'Pix'
        case 'CreditCard':
            return 'Cartão de crédito'
        case 'DebitCard':
            return 'Cartão de débito'
        default:
            return 'Não definida'
    }
}
