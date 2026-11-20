import { StockItemPackageModel } from '@/features/stockItems/services/stockItem.api'
import {
    formatStockQuantity,
    getStockUnit,
} from '@/features/stockItems/services/stockItemUnits'

export type QuantityUnitOption = {
    value: string
    label: string
    factor: number
}

export function buildQuantityUnitOptions(
    baseUnit: string | number,
    packages: StockItemPackageModel[]
): QuantityUnitOption[] {
    const info = getStockUnit(baseUnit)

    const packageOptions = packages.map((pkg) => ({
        value: `package-${pkg.id}`,
        label: `${pkg.name} (${formatStockQuantity(pkg.quantityInBaseUnit, baseUnit)})`,
        factor: pkg.quantityInBaseUnit,
    }))

    const measureOptions =
        info.largeFactor > 1
            ? [
                  {
                      value: 'large',
                      label: info.largeSymbol,
                      factor: info.largeFactor,
                  },
                  { value: 'base', label: info.baseSymbol, factor: 1 },
              ]
            : [{ value: 'base', label: info.baseSymbol, factor: 1 }]

    return [...packageOptions, ...measureOptions]
}
