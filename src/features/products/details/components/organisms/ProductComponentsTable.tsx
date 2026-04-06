'use client'

import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { DataTable } from 'ui/dataTable'
import { ProductComponentModel } from '@/features/products/services/product.model'
import { productComponentsColumns } from '@/features/products/details/components/molecules/ProductComponentsColumns'
import { NewProductComponentModal } from '@/features/products/details/components/molecules/NewProductComponentModal'

type Props = {
    components?: ProductComponentModel[]
    isLoading: boolean
    error: unknown
}

export function ProductComponentsTable({
    components,
    isLoading,
    error,
}: Props) {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const [searchValue, setSearchValue] = useState('')

    if (isLoading) return <p>Carregando componentes...</p>
    if (error) return <p>Não foi possivel carregar os componentes</p>

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
                <NewProductComponentModal />
            </div>

            <DataTable
                columns={productComponentsColumns}
                data={components ?? []}
                noDataMessage="Nenhum componente encontrado"
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
            />
        </section>
    )
}
