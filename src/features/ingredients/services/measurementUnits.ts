export const MEASUREMENT_UNITS = [
    { value: 'Unit', label: 'Unidade (un)', enumValue: 0 },
    { value: 'Gram', label: 'Grama (g)', enumValue: 1 },
    { value: 'Milliliter', label: 'Mililitro (ml)', enumValue: 2 },
] as const

export type MeasurementUnitValue = (typeof MEASUREMENT_UNITS)[number]['value']

export type UnitConversionOption = {
    name: string
    quantityInBaseUnit: number
}

const measurementUnitAliases = new Map<string, MeasurementUnitValue>([
    ['0', 'Unit'],
    ['1', 'Gram'],
    ['2', 'Milliliter'],
    ['unit', 'Unit'],
    ['un', 'Unit'],
    ['gram', 'Gram'],
    ['g', 'Gram'],
    ['milliliter', 'Milliliter'],
    ['ml', 'Milliliter'],
])

const measurementUnitLabelMap = new Map<string, string>([
    ...MEASUREMENT_UNITS.map((unit) => [unit.value, unit.label]),
    ['un', 'Unidade (un)'],
    ['g', 'Grama (g)'],
    ['ml', 'Mililitro (ml)'],
    ['kg', 'Quilograma (kg)'],
    ['l', 'Litro (l)'],
])

export const normalizeMeasurementUnit = (
    unit: string | number | null | undefined
): MeasurementUnitValue => {
    const normalized = String(unit ?? '').trim()

    if (!normalized) return 'Unit'

    return measurementUnitAliases.get(normalized.toLowerCase()) ?? 'Unit'
}

export const getMeasurementUnitLabel = (unit: string | number) => {
    const normalized = normalizeMeasurementUnit(unit)
    return measurementUnitLabelMap.get(normalized) ?? normalized
}

export const isMeasurementUnitOption = (unit: string | number) => {
    const normalized = normalizeMeasurementUnit(unit)
    return MEASUREMENT_UNITS.some((option) => option.value === normalized)
}


export const getBaseUnitEnumValue = (unit: string | number) => {
    const normalized = normalizeMeasurementUnit(unit)

    return (
        MEASUREMENT_UNITS.find((option) => option.value === normalized)?.enumValue ?? 0
    )
}

export const DEFAULT_CONVERSIONS_BY_BASE_UNIT: Record<
    MeasurementUnitValue,
    UnitConversionOption[]
> = {
    Unit: [
        { name: 'unidade', quantityInBaseUnit: 1 },
        { name: 'dúzia', quantityInBaseUnit: 12 },
    ],
    Gram: [
        { name: 'grama', quantityInBaseUnit: 1 },
        { name: 'quilo', quantityInBaseUnit: 1000 },
    ],
    Milliliter: [
        { name: 'mililitro', quantityInBaseUnit: 1 },
        { name: 'litro', quantityInBaseUnit: 1000 },
    ],
}

export const getDefaultConversionsForBaseUnit = (baseUnit: string | number) =>
    DEFAULT_CONVERSIONS_BY_BASE_UNIT[normalizeMeasurementUnit(baseUnit)] ?? []
