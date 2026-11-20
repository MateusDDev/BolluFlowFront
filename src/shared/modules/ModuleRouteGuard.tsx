'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useModules } from '@/shared/modules/useModules'
import { useCurrentNavItem } from '@/shared/navigation/useCurrentNavItem'

export function ModuleRouteGuard({ children }: { children: ReactNode }) {
    const router = useRouter()
    const currentItem = useCurrentNavItem()
    const { hasAnyModule } = useModules()

    const isBlocked =
        !!currentItem?.modules && !hasAnyModule(currentItem.modules)

    useEffect(() => {
        if (isBlocked) router.replace('/')
    }, [isBlocked, router])

    if (isBlocked) return null

    return <>{children}</>
}
