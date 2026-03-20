'use client'

import { useEffect, useState } from 'react'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

const FINANCIAL_MONTH_EVENT = 'financial-month-change'

function readMonthFromUrl() {
    if (typeof window === 'undefined') {
        return getCurrentMonthValue()
    }

    return (
        new URLSearchParams(window.location.search).get('month') ??
        getCurrentMonthValue()
    )
}

export function setFinancialMonthInUrl(month: string) {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    url.searchParams.set('month', month)
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(FINANCIAL_MONTH_EVENT))
}

export function useFinancialMonthParam() {
    const [month, setMonth] = useState(readMonthFromUrl)

    useEffect(() => {
        const syncMonth = () => setMonth(readMonthFromUrl())

        window.addEventListener('popstate', syncMonth)
        window.addEventListener(FINANCIAL_MONTH_EVENT, syncMonth)

        return () => {
            window.removeEventListener('popstate', syncMonth)
            window.removeEventListener(FINANCIAL_MONTH_EVENT, syncMonth)
        }
    }, [])

    return month
}
