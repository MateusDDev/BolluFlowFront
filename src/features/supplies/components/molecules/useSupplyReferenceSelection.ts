'use client'

import { useEffect, useState } from 'react'
import { useGetStockUnitPreference } from '@/features/stock/hooks/queries/useGetStockUnitPreference'
import { useSetStockUnitPreference } from '@/features/stock/hooks/mutations/useSetStockUnitPreference'

const BASE_OPTION_VALUE = '__base__'

export const getReferenceKey = (supplyId: number) =>
    `supply-reference-selection:${supplyId}`

export function useSupplyReferenceSelection(supplyId: number) {
    const { data: preference } = useGetStockUnitPreference('supply', supplyId)
    const setStockUnitPreference = useSetStockUnitPreference()
    const [selectedConversion, setSelectedConversionState] =
        useState(BASE_OPTION_VALUE)

    useEffect(() => {
        const key = getReferenceKey(supplyId)
        const stored = window.localStorage.getItem(key)
        if (stored) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedConversionState(stored)
        }

        const listener = (event: Event) => {
            const customEvent = event as CustomEvent<{
                key: string
                value: string
            }>
            if (customEvent.detail?.key === key) {
                setSelectedConversionState(customEvent.detail.value)
            }
        }

        window.addEventListener('supply-reference-change', listener)

        return () => {
            window.removeEventListener('supply-reference-change', listener)
        }
    }, [supplyId])

    useEffect(() => {
        if (!Number.isFinite(supplyId)) return

        const preferenceValue =
            preference?.conversionId == null
                ? BASE_OPTION_VALUE
                : String(preference.conversionId)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedConversionState(preferenceValue)
    }, [supplyId, preference?.conversionId])

    const setSelectedConversion = (value: string) => {
        const key = getReferenceKey(supplyId)
        window.localStorage.setItem(key, value)
        setSelectedConversionState(value)
        setStockUnitPreference.mutate({
            itemType: 'supply',
            itemId: supplyId,
            conversionId: value === BASE_OPTION_VALUE ? null : Number(value),
        })
        window.dispatchEvent(
            new CustomEvent('supply-reference-change', {
                detail: { key, value },
            })
        )
    }

    return { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE }
}
