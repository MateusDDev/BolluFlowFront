'use client'

import { createContext, useContext, useState } from 'react'

type PageTitleContextType = {
    title: string | null
    setTitle: (title: string | null) => void
}

const PageTitleContext = createContext<PageTitleContextType | null>(null)

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState<string | null>(null)

    return (
        <PageTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </PageTitleContext.Provider>
    )
}

export function usePageTitle() {
    const context = useContext(PageTitleContext)
    if (!context) {
        throw new Error('usePageTitle must be used within PageTitleProvider')
    }
    return context
}
