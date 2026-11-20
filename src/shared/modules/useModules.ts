'use client'

import { useCallback, useMemo } from 'react'
import { useMe } from '@/features/login/hooks/useMe'
import { AppModule } from '@/shared/modules/modules'

export function useModules() {
    const { data: user } = useMe()

    const enabledModules = useMemo(
        () => user?.enabledModules ?? [],
        [user?.enabledModules]
    )

    const hasModule = useCallback(
        (module: AppModule) => enabledModules.includes(module),
        [enabledModules]
    )

    const hasAnyModule = useCallback(
        (modules: AppModule[]) =>
            modules.some((module) => enabledModules.includes(module)),
        [enabledModules]
    )

    return { enabledModules, hasModule, hasAnyModule }
}
