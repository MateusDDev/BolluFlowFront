'use client'

import { useEffect, useState } from 'react'

const BASE_OPTION_VALUE = '__base__'

export const getReferenceKey = (supplyId: number) =>
    `supply-reference-selection:${supplyId}`

export function useSupplyReferenceSelection(supplyId: number) {
    const [selectedConversion, setSelectedConversionState] = useState(
        BASE_OPTION_VALUE
    )

    useEffect(() => {
        const key = getReferenceKey(supplyId)
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

        window.addEventListener('supply-reference-change', listener)

        return () => {
            window.removeEventListener('supply-reference-change', listener)
        }
    }, [supplyId])

    const setSelectedConversion = (value: string) => {
        const key = getReferenceKey(supplyId)
        window.localStorage.setItem(key, value)
        setSelectedConversionState(value)
        window.dispatchEvent(
            new CustomEvent('supply-reference-change', {
                detail: { key, value },
            })
        )
    }

    return { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE }
}
