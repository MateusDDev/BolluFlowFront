import { useQuery } from '@tanstack/react-query'
import {
    getStockUnitPreference,
    StockUnitPreferenceItemType,
} from '@/features/stock/services/stockUnitPreference.api'

export function useGetStockUnitPreference(
    itemType: StockUnitPreferenceItemType,
    itemId: number
) {
    return useQuery({
        queryKey: ['stock-unit-preference', itemType, itemId],
        queryFn: () => getStockUnitPreference(itemType, itemId),
        enabled: Number.isFinite(itemId),
    })
}
