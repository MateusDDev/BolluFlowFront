'use client'

import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { DataTable } from 'ui/dataTable'
import { useGetOrders } from '@/features/orders/list/hooks/queries/useGetOrders'
import { orderColumns } from '@/features/orders/list/components/molecules/OrderColumns'
import { NewOrderModal } from '@/features/orders/list/components/organisms/NewOrderModal'

export function OrdersTableContainer() {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const { data: orders, isLoading, error } = useGetOrders()
    const [searchValue, setSearchValue] = useState<string>('')

    if (isLoading) return <p>Carregando pedidos...</p>

    if (error) return <p>Não foi possível carregar as pedidos</p>

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
                            setFilters([{ id: 'customer', value: searchValue }])
                        }
                    >
                        <Search className="text-primary" />
                    </Button>
                </div>
                <NewOrderModal />
            </div>
            <div>
                <DataTable
                    columns={orderColumns}
                    data={orders ?? []}
                    noDataMessage="Nenhum pedido encontrado"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}
