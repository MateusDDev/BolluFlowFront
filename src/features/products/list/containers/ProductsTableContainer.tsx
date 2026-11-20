'use client'

import { Input } from 'ui/input'
import { useModuleColumns } from '@/shared/modules/moduleColumns'
import { Button } from 'ui/button'
import { Package, Search } from 'lucide-react'
import { EmptyState } from 'components/EmptyState'
import { DataTable } from 'ui/dataTable'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useGetProducts } from '@/features/products/list/hooks/queries/useGetProducts'
import { productColumns } from '@/features/products/list/components/molecules/ProductColumns'
import { NewProductModal } from '@/features/products/list/components/organisms/NewProductModal'

export const ProductsTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const columns = useModuleColumns(productColumns)
    const { data: products, isLoading, error } = useGetProducts()
    const [searchValue, setSearchValue] = useState<string>('')
    const router = useRouter()

    if (isLoading) return <p>Carregando produtos...</p>

    if (error) return <p>Não foi possivel carregar os produtos</p>

    if (!products?.length)
        return (
            <section className="container mx-auto py-10">
                <EmptyState
                    icon={Package}
                    title="Cadastre o que você vende"
                    description="Com nome e preço o produto já aparece nos pedidos e no cardápio online. Custo e margem vêm depois, se você quiser."
                    example="Ex.: Brigadeiro gourmet, R$ 3,50"
                    action={<NewProductModal />}
                />
            </section>
        )

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
                    columns={columns}
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
