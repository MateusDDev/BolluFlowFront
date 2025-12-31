'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/features/login/hooks/useMe'

type Props = {
    children: ReactNode
}

export function AuthWrapper({ children }: Props) {
    const router = useRouter()
    const { data: user, isLoading, isError } = useMe()

    useEffect(() => {
        if (isError) {
            router.push('/login')
        }
    }, [isError, router])

    if (isLoading) {
        return null
    }

    if (!user) return null

    return <>{children}</>
}
