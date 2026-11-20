'use client'

import { useMe } from '@/features/login/hooks/useMe'
import { AppModule } from '@/shared/modules/modules'

export function useModules() {
    const { data: user } = useMe()
    const enabledModules = user?.enabledModules ?? []

    const hasModule = (module: AppModule) => enabledModules.includes(module)
    const hasAnyModule = (modules: AppModule[]) =>
        modules.some((module) => enabledModules.includes(module))

    return { enabledModules, hasModule, hasAnyModule }
}
