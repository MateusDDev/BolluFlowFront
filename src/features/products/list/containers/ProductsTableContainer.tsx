'use client'

import { Input } from 'ui/input'
import { useModules } from '@/shared/modules/useModules'
import { withoutStockColumns } from '@/shared/modules/stock'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { DataTable } from 'ui/dataTable'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useGetProducts } from '@/features/products/list/hooks/queries/useGetProducts'
import { productColumns } from '@/features/products/list/components/molecules/ProductColumns'
import { NewProductModal } from '@/features/products/list/components/organisms/NewProductModal'

export const ProductsTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const { hasModule } = useModules()
    const { data: products, isLoading, error } = useGetProducts()
    const [searchValue, setSearchValue] = useState<string>('')
    const router = useRouter()

    if (isLoading) return <p>Carregando produtos...</p>

    if (error) return <p>Não foi possivel carregar os produtos</p>

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
                <NewProductModal />
            </div>
            <div>
                <DataTable
                    columns={
                        hasModule('stock')
                            ? productColumns
                            : withoutStockColumns(productColumns)
                    }
                    data={products ?? []}
                    noDataMessage="Nenhum produto encontrado"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                    onRowClick={(product) =>
                        router.push(`/products/${product.id}`)
                    }
                />
            </div>
        </section>
    )
}
