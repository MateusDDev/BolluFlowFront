function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`

    const hours = Math.floor(minutes / 60)
    const rest = minutes % 60

    return rest === 0
        ? `${hours}h`
        : `${hours}h${String(rest).padStart(2, '0')}`
}

export function getDeliveryTimeLabel(minutes?: number | null): string | null {
    if (!minutes) return null

    return `Entrega em até ${formatDuration(minutes)}`
}
