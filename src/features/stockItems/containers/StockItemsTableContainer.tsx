'use client'

import { useState } from 'react'
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table'
import { Plus, Search } from 'lucide-react'
import { Button } from 'ui/button'
import { DataTable } from 'ui/dataTable'
import { Input } from 'ui/input'
import { useModuleColumns } from '@/shared/modules/moduleColumns'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import { StockItemModel } from '@/features/stockItems/services/stockItem.api'
import { useStockItems } from '@/features/stockItems/hooks/useStockItems'
import { StockItemFormDialog } from '@/features/stockItems/components/StockItemFormDialog'

type Props<TItem extends StockItemModel> = {
    config: StockItemConfig
    columns: ColumnDef<TItem>[]
}

export function StockItemsTableContainer<TItem extends StockItemModel>({
    config,
    columns,
}: Props<TItem>) {
    const { data, isLoading, error } = useStockItems(config)
    const visibleColumns = useModuleColumns(columns)
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    if (isLoading) return <p className="py-10">Carregando {config.plural}...</p>
    if (error) {
        return (
            <p className="py-10">
                Não foi possível carregar os {config.plural}
            </p>
        )
    }

    return (
        <section className="container mx-auto space-y-3 py-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="relative w-full max-w-xs">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        type="search"
                        placeholder={`Buscar ${config.singular}`}
                        className="pl-9"
                        onChange={(e) =>
                            setFilters([{ id: 'name', value: e.target.value }])
                        }
                    />
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4" />
                    {config.newLabel}
                </Button>
            </div>

            <DataTable
                columns={visibleColumns}
                data={(data ?? []) as TItem[]}
                noDataMessage={`Nenhum ${config.singular} cadastrado ainda`}
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
            />

            <StockItemFormDialog
                config={config}
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />
        </section>
    )
}
