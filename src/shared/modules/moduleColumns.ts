'use client'

import { useMemo } from 'react'
import { ColumnDef, RowData } from '@tanstack/react-table'
import { AppModule } from '@/shared/modules/modules'
import { useModules } from '@/shared/modules/useModules'

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        module?: AppModule
    }
}

export function useModuleColumns<TData, TValue>(
    columns: ColumnDef<TData, TValue>[]
) {
    const { hasModule } = useModules()

    return useMemo(
        () =>
            columns.filter(
                (column) =>
                    !column.meta?.module || hasModule(column.meta.module)
            ),
        [columns, hasModule]
    )
}
