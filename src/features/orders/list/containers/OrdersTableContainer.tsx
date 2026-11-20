'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { DataTable } from 'ui/dataTable'
import { useGetOrders } from '@/features/orders/list/hooks/queries/useGetOrders'
import { orderColumns } from '@/features/orders/list/components/molecules/OrderColumns'
import Link from 'next/link'
import { Plus, ShoppingBag } from 'lucide-react'

export function OrdersTableContainer() {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const { data: orders, isLoading, error } = useGetOrders()
    const [searchValue, setSearchValue] = useState<string>('')
    const router = useRouter()

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
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/orders/new?mode=order">
                            <Plus className="h-4 w-4" />
                            Encomenda
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/orders/new?mode=quick">
                            <ShoppingBag className="h-4 w-4" />
                            Venda rápida
                        </Link>
                    </Button>
                </div>
            </div>
            <div>
                <DataTable
                    columns={orderColumns}
                    data={orders ?? []}
                    noDataMessage="Nenhum pedido encontrado"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                    onRowClick={(order) => router.push(`/orders/${order.id}`)}
                />
            </div>
        </section>
    )
}
