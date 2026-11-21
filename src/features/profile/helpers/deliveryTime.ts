export type DeliveryTimeUnit = 'minutes' | 'hours'

const MAX_DELIVERY_TIME_MINUTES = 24 * 60

export function splitDeliveryTime(minutes?: number | null): {
    value: string
    unit: DeliveryTimeUnit
} {
    if (!minutes) return { value: '', unit: 'minutes' }

    return minutes % 60 === 0
        ? { value: String(minutes / 60), unit: 'hours' }
        : { value: String(minutes), unit: 'minutes' }
}

export function toDeliveryTimeMinutes(
    value: string,
    unit: DeliveryTimeUnit
): number | null | undefined {
    const trimmed = value.trim()

    if (trimmed === '') return null
    if (!/^\d+$/.test(trimmed)) return undefined

    const minutes = Number(trimmed) * (unit === 'hours' ? 60 : 1)

    return minutes >= 1 && minutes <= MAX_DELIVERY_TIME_MINUTES
        ? minutes
        : undefined
}
