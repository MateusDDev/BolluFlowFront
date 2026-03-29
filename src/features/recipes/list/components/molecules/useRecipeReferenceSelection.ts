'use client'

import { useEffect, useState } from 'react'

const BASE_OPTION_VALUE = '__base__'

const getReferenceKey = (recipeId: number) =>
    `recipe-reference-selection:${recipeId}`

export function useRecipeReferenceSelection(recipeId: number) {
    const [selectedConversion, setSelectedConversionState] =
        useState(BASE_OPTION_VALUE)

    useEffect(() => {
        const key = getReferenceKey(recipeId)
        const stored = window.localStorage.getItem(key)

        if (stored) {
            setSelectedConversionState(stored)
        }

        const listener = (event: Event) => {
            const customEvent = event as CustomEvent<{ key: string; value: string }>
            if (customEvent.detail?.key === key) {
                setSelectedConversionState(customEvent.detail.value)
            }
        }

        window.addEventListener('recipe-reference-change', listener)

        return () => {
            window.removeEventListener('recipe-reference-change', listener)
        }
    }, [recipeId])

    const setSelectedConversion = (value: string) => {
        const key = getReferenceKey(recipeId)
        window.localStorage.setItem(key, value)
        setSelectedConversionState(value)
        window.dispatchEvent(
            new CustomEvent('recipe-reference-change', {
                detail: { key, value },
            })
        )
    }

    return { selectedConversion, setSelectedConversion, BASE_OPTION_VALUE }
}
