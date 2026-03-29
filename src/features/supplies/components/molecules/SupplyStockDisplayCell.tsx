'use client'

import { useMemo } from 'react'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { useGetSupplyConversions } from '@/features/supplies/hooks/queries/useGetSupplyConversions'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { useSupplyReferenceSelection } from '@/features/supplies/components/molecules/useSupplyReferenceSelection'

type Props = {
    supply: SupplyModel
    value: number
}

export function SupplyStockDisplayCell({ supply, value }: Props) {
    const { data: conversions } = useGetSupplyConversions(supply.id, true)

    const options = useMemo(
        () =>
            (conversions ?? []).map((item) => ({
                value: String(item.id),
                label: item.name,
                factor: item.quantityInBaseUnit,
            })),
        [conversions]
    )

    const { selectedConversion, BASE_OPTION_VALUE } =
        useSupplyReferenceSelection(supply.id)

    const factor =
        selectedConversion === BASE_OPTION_VALUE
            ? 1
            : options.find((item) => item.value === selectedConversion)?.factor ?? 1

    const label =
        selectedConversion === BASE_OPTION_VALUE
            ? getMeasurementUnitLabel(supply.baseUnit)
            : options.find((item) => item.value === selectedConversion)?.label ??
              getMeasurementUnitLabel(supply.baseUnit)

    const converted = value / factor

    return (
        <span>
            {converted.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {label}
        </span>
    )
}
