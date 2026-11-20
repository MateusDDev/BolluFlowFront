'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from '@/features/login/hooks/useMe'

type Props = {
    children: ReactNode
    onboarding?: boolean
}

export function AuthWrapper({ children, onboarding = false }: Props) {
    const router = useRouter()
    const { data: user, isLoading, isError } = useMe()

    const hasCompletedOnboarding = Boolean(user?.onboardingCompletedAt)
    const shouldRedirect = user != null && hasCompletedOnboarding === onboarding

    useEffect(() => {
        if (isError) {
            router.push('/login')
            return
        }

        if (shouldRedirect) {
            router.replace(onboarding ? '/' : '/onboarding')
        }
    }, [isError, shouldRedirect, onboarding, router])

    if (isLoading) {
        return null
    }

    if (!user || shouldRedirect) return null

    return <>{children}</>
}
