'use client'

import { useState } from 'react'
import { useModules } from '@/shared/modules/useModules'
import { withoutStockColumns } from '@/shared/modules/stock'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { DataTable } from 'ui/dataTable'
import { useGetSupplies } from '@/features/supplies/hooks/queries/useGetSupplies'
import { supplyColumns } from '@/features/supplies/components/molecules/SupplyColumns'
import { NewSupplyModal } from '@/features/supplies/components/organisms/NewSupplyModal'

export function SuppliesTableContainer() {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const { hasModule } = useModules()
    const [searchValue, setSearchValue] = useState('')
    const { data: supplies, isLoading, error } = useGetSupplies()

    if (isLoading) return <p>Carregando insumos...</p>
    if (error) return <p>Não foi possivel carregar os insumos</p>

    return (
        <section className="container mx-auto py-10">
            <div className="flex w-full items-center gap-2 mb-2 justify-between">
                <div className="flex gap-2">
                    <Input
                        type="search"
                        placeholder="Pesquisar"
                        value={searchValue}
                        onChange={({ target }) => setSearchValue(target.value)}
                    />
                    <Button
                        type="submit"
                        variant="secondary"
                        onClick={() =>
                            setFilters([{ id: 'name', value: searchValue }])
                        }
                    >
                        <Search className="text-primary" />
                    </Button>
                </div>
                <NewSupplyModal />
            </div>
            <DataTable
                columns={
                    hasModule('stock')
                        ? supplyColumns
                        : withoutStockColumns(supplyColumns)
                }
                data={supplies ?? []}
                noDataMessage="Nenhum insumo encontrado"
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
            />
        </section>
    )
}
