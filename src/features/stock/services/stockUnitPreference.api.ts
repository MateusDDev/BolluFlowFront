import { apiClient } from '@/shared/api/client'

export type StockUnitPreferenceItemType = 'ingredient' | 'supply'

type StockUnitPreferenceResponse = {
    conversionId?: number | null
} | null

export function getStockUnitPreference(
    itemType: StockUnitPreferenceItemType,
    itemId: number
) {
    const searchParams = new URLSearchParams({
        itemType,
        itemId: String(itemId),
    })

    return apiClient<StockUnitPreferenceResponse>(
        `/preferences/stock-unit?${searchParams.toString()}`,
        'GET'
    )
}

export function setStockUnitPreference(params: {
    itemType: StockUnitPreferenceItemType
    itemId: number
    conversionId: number | null
}) {
    return apiClient<void>('/preferences/stock-unit', 'POST', params)
}
