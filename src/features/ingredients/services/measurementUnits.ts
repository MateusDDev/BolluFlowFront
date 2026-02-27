export const MEASUREMENT_UNITS = [
    { value: 'Unit', label: 'Unidade (un)' },
    { value: 'Gram', label: 'Grama (g)' },
    { value: 'Milliliter', label: 'Mililitro (ml)' },
] as const

const measurementUnitLabelMap = new Map<string, string>([
    ...MEASUREMENT_UNITS.map((unit) => [unit.value, unit.label]),
    ['un', 'Unidade (un)'],
    ['g', 'Grama (g)'],
    ['ml', 'Mililitro (ml)'],
    ['kg', 'Quilograma (kg)'],
    ['l', 'Litro (l)'],
])

export const getMeasurementUnitLabel = (unit: string) =>
    measurementUnitLabelMap.get(unit) ?? unit

export const isMeasurementUnitOption = (unit: string) =>
    MEASUREMENT_UNITS.some((option) => option.value === unit)

export const DEFAULT_CONVERSIONS_BY_BASE_UNIT: Record<
    string,
    Array<{ name: string; quantityInBaseUnit: number }>
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
