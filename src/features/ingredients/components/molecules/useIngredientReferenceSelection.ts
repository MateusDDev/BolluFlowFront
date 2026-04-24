'use client'

import { useEffect, useState } from 'react'
import { useGetStockUnitPreference } from '@/features/stock/hooks/queries/useGetStockUnitPreference'
import { useSetStockUnitPreference } from '@/features/stock/hooks/mutations/useSetStockUnitPreference'

const BASE_OPTION_VALUE = '__base__'

export const getReferenceKey = (ingredientId: number) =>
    `ingredient-reference-selection:${ingredientId}`

export function useIngredientReferenceSelection(ingredientId: number) {
    const { data: preference } = useGetStockUnitPreference('ingredient', ingredientId)
    const setStockUnitPreference = useSetStockUnitPreference()
    const [selectedConversion, setSelectedConversionState] = useState(
        BASE_OPTION_VALUE
    )

    useEffect(() => {
        const key = getReferenceKey(ingredientId)
        const stored = window.localStorage.getItem(key)
        if (stored) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedConversionState(stored)
        }

        const listener = (event: Event) => {
            const customEvent = event as CustomEvent<{ key: string; value: string }>
            if (customEvent.detail?.key === key) {
                setSelectedConversionState(customEvent.detail.value)
            }
        }

        window.addEventListener('ingredient-reference-change', listener)

        return () => {
            window.removeEventListener('ingredient-reference-change', listener)
        }
    }, [ingredientId])

    useEffect(() => {
        if (!Number.isFinite(ingredientId)) return

        const preferenceValue =
            preference?.conversionId == null
                ? BASE_OPTION_VALUE
                : String(preference.conversionId)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedConversionState(preferenceValue)
    }, [ingredientId, preference?.conversionId])

    const setSelectedConversion = (value: string) => {
        const key = getReferenceKey(ingredientId)
        window.localStorage.setItem(key, value)
        setSelectedConversionState(value)
        setStockUnitPreference.mutate({
            itemType: 'ingredient',
            itemId: ingredientId,
            conversionId: value === BASE_OPTION_VALUE ? null : Number(value),
        })
        window.dispatchEvent(
            new CustomEvent('ingredient-reference-change', {
                detail: { key, value },
            })
        )
    }

    return { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE }
}
