'use client'

import { useMemo } from 'react'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { useGetSupplyConversions } from '@/features/supplies/hooks/queries/useGetSupplyConversions'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useSupplyReferenceSelection } from '@/features/supplies/components/molecules/useSupplyReferenceSelection'

type Props = {
    supply: SupplyModel
}

export function SupplyCostDisplayCell({ supply }: Props) {
    const { data: conversions } = useGetSupplyConversions(supply.id, true)

    const options = useMemo(
        () =>
            (conversions ?? []).map((item) => ({
                value: String(item.id),
                factor: item.quantityInBaseUnit,
            })),
        [conversions]
    )

    const { selectedConversion, BASE_OPTION_VALUE } =
        useSupplyReferenceSelection(supply.id)

    const factor =
        selectedConversion === BASE_OPTION_VALUE
            ? 1
            : (options.find((item) => item.value === selectedConversion)
                  ?.factor ?? 1)

    return <span>{formatCurrency(supply.unitCost * factor)}</span>
}
