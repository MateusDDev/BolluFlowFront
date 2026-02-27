'use client'

import { useEffect, useState } from 'react'

const BASE_OPTION_VALUE = '__base__'

export const getReferenceKey = (ingredientId: number) =>
    `ingredient-reference-selection:${ingredientId}`

export function useIngredientReferenceSelection(ingredientId: number) {
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

    const setSelectedConversion = (value: string) => {
        const key = getReferenceKey(ingredientId)
        window.localStorage.setItem(key, value)
        setSelectedConversionState(value)
        window.dispatchEvent(
            new CustomEvent('ingredient-reference-change', {
                detail: { key, value },
            })
        )
    }

    return { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE }
}
