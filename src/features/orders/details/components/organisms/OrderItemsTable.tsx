'use client'

import React, { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { DataTable } from 'ui/dataTable'
import { useGetOrderItems } from '@/features/orders/details/hooks/queries/useGetOrderItems'
import { useParams } from 'next/navigation'
import { orderItemsColumns } from '@/features/orders/details/components/molecules/OrderItemsColumns'
import { NewOrderItemModal } from '@/features/orders/details/components/molecules/NewOrderItemModal'

export const OrderItemsTable = () => {
    const { id } = useParams<{ id: string }>()
    const orderId = Number(id)

    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const { data: orderItems, isLoading, error } = useGetOrderItems(orderId)
    const [searchValue, setSearchValue] = useState<string>('')

    if (isLoading) return <p>Carregando produtos...</p>

    if (error) return <p>Nao foi possivel carregar os produtos</p>

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
                            setFilters([
                                { id: 'product.name', value: searchValue },
                            ])
                        }
                    >
                        <Search className="text-primary" />
                    </Button>
                </div>

                <NewOrderItemModal />
            </div>
            <div>
                <DataTable
                    columns={orderItemsColumns}
                    data={orderItems ?? []}
                    noDataMessage="Nenhum produto encontrado"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}
