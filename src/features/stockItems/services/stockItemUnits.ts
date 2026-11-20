import { formatCurrency } from '@/shared/helpers/formatHelper'
import {
    MeasurementUnitValue,
    normalizeMeasurementUnit,
} from '@/features/ingredients/services/measurementUnits'

type UnitInfo = {
    chipLabel: string
    baseSymbol: string
    largeSymbol: string
    largeName: string
    largeFactor: number
    priceLabel: string
}

export const STOCK_UNITS: Record<MeasurementUnitValue, UnitInfo> = {
    Gram: {
        chipLabel: 'Peso (g, kg)',
        baseSymbol: 'g',
        largeSymbol: 'kg',
        largeName: 'quilo',
        largeFactor: 1000,
        priceLabel: 'Preço por quilo',
    },
    Milliliter: {
        chipLabel: 'Volume (ml, L)',
        baseSymbol: 'ml',
        largeSymbol: 'L',
        largeName: 'litro',
        largeFactor: 1000,
        priceLabel: 'Preço por litro',
    },
    Unit: {
        chipLabel: 'Unidade',
        baseSymbol: 'un',
        largeSymbol: 'un',
        largeName: 'unidade',
        largeFactor: 1,
        priceLabel: 'Preço por unidade',
    },
}

export function getStockUnit(unit: string | number) {
    return STOCK_UNITS[normalizeMeasurementUnit(unit)]
}

function formatNumber(value: number, maximumFractionDigits = 2) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits })
}

export function formatStockQuantity(quantity: number, unit: string | number) {
    const info = getStockUnit(unit)

    if (info.largeFactor > 1 && Math.abs(quantity) >= info.largeFactor) {
        return `${formatNumber(quantity / info.largeFactor)} ${info.largeSymbol}`
    }

    return `${formatNumber(quantity)} ${info.baseSymbol}`
}

export function formatUnitCost(costPerBaseUnit: number, unit: string | number) {
    const info = getStockUnit(unit)

    return `${formatCurrency(costPerBaseUnit * info.largeFactor)} / ${info.largeSymbol}`
}

export function toBaseQuantity(largeQuantity: number, unit: string | number) {
    return largeQuantity * getStockUnit(unit).largeFactor
}

export function fromBaseQuantity(baseQuantity: number, unit: string | number) {
    return baseQuantity / getStockUnit(unit).largeFactor
}
