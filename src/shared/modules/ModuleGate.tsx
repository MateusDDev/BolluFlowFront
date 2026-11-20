'use client'

import { ReactNode } from 'react'
import { AppModule } from '@/shared/modules/modules'
import { useModules } from '@/shared/modules/useModules'

type Props = {
    module: AppModule | AppModule[]
    children: ReactNode
    fallback?: ReactNode
}

export function ModuleGate({ module, children, fallback = null }: Props) {
    const { hasAnyModule } = useModules()
    const modules = Array.isArray(module) ? module : [module]

    return <>{hasAnyModule(modules) ? children : fallback}</>
}
