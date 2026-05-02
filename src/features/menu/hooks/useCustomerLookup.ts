'use client'

import { useCallback } from 'react'
import { CUSTOMER_STORAGE_KEY } from '@/features/menu/constants/menu.constants'
import { lookupPublicCustomer } from '@/features/menu/services/menu.api'
import { StoredCustomer } from '@/features/menu/types/menu.types'

function readStoredCustomer(whatsapp: string): StoredCustomer | null {
    try {
        const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY(whatsapp))
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}

function saveStoredCustomer(customer: StoredCustomer) {
    localStorage.setItem(
        CUSTOMER_STORAGE_KEY(customer.whatsapp),
        JSON.stringify(customer)
    )
}

export function useCustomerLookup(slug: string) {
    const lookupCustomer = useCallback(
        async (whatsapp: string): Promise<StoredCustomer | null> => {
            if (whatsapp.length < 10) return null

            const response = await lookupPublicCustomer(slug, whatsapp)

            if (!response.exists) return null

            return readStoredCustomer(whatsapp)
        },
        [slug]
    )

    return {
        lookupCustomer,
        saveCustomer: saveStoredCustomer,
    }
}
