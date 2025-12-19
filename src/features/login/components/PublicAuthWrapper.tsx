'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/features/login/hooks/useMe'

type Props = {
    children: ReactNode
}

export function PublicAuthWrapper({ children }: Props) {
    const router = useRouter()
    const { data: user, isLoading } = useMe()

    useEffect(() => {
        if (!isLoading && user) {
            router.push('/')
        }
    }, [isLoading, user, router])

    return <>{children}</>
}
