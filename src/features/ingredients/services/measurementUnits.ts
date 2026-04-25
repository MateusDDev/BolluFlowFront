export const MEASUREMENT_UNITS = [
    { value: 'Unit', label: '(un)', enumValue: 0 },
    { value: 'Gram', label: '(g)', enumValue: 1 },
    { value: 'Milliliter', label: '(ml)', enumValue: 2 },
] as const

export type MeasurementUnitValue = (typeof MEASUREMENT_UNITS)[number]['value']

export type UnitConversionOption = {
    name: string
    quantityInBaseUnit: number
}

const enumToMeasurementUnit: Record<string, MeasurementUnitValue> = {
    '0': 'Unit',
    '1': 'Gram',
    '2': 'Milliliter',
}

const measurementUnitLabelMap: Record<MeasurementUnitValue, string> = {
    Unit: '(un)',
    Gram: '(g)',
    Milliliter: '(ml)',
}

export const normalizeMeasurementUnit = (
    unit: string | number | null | undefined
): MeasurementUnitValue => {
    const rawUnit = String(unit ?? '').trim()

    if (!rawUnit) return 'Unit'

    if (rawUnit in enumToMeasurementUnit) {
        return enumToMeasurementUnit[rawUnit]
    }

    const matchedUnit = MEASUREMENT_UNITS.find(
        (measurementUnit) =>
            measurementUnit.value.toLowerCase() === rawUnit.toLowerCase()
    )

    return matchedUnit?.value ?? 'Unit'
}

export const getMeasurementUnitLabel = (unit: string | number) =>
    measurementUnitLabelMap[normalizeMeasurementUnit(unit)]

export const isMeasurementUnitOption = (unit: string | number) =>
    MEASUREMENT_UNITS.some(
        (measurementUnit) =>
            measurementUnit.value === normalizeMeasurementUnit(unit)
    )

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
