'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Plus, Search, ShoppingBag } from 'lucide-react'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { DataTable } from 'ui/dataTable'
import { ChipGroup, ChipOption } from 'components/ChipGroup'
import { useGetOrders } from '@/features/orders/list/hooks/queries/useGetOrders'
import { orderColumns } from '@/features/orders/list/components/molecules/OrderColumns'

type OrderTypeFilter = 'all' | 'orders' | 'quick'

const TYPE_FILTER_STORAGE_KEY = 'orders.typeFilter'

const TYPE_FILTER_OPTIONS: ChipOption<OrderTypeFilter>[] = [
    { value: 'all', label: 'Todos' },
    { value: 'orders', label: 'Encomendas' },
    { value: 'quick', label: 'Vendas rápidas' },
]

function readStoredTypeFilter(): OrderTypeFilter {
    try {
        const value = localStorage.getItem(TYPE_FILTER_STORAGE_KEY)
        return value === 'orders' || value === 'quick' ? value : 'all'
    } catch {
        return 'all'
    }
}

export function OrdersTableContainer() {
    const router = useRouter()
    const { data: orders, isLoading, error } = useGetOrders()
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const [searchValue, setSearchValue] = useState('')
    const [typeFilter, setTypeFilter] =
        useState<OrderTypeFilter>(readStoredTypeFilter)

    const visibleOrders = useMemo(() => {
        const sorted = [...(orders ?? [])].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )

        if (typeFilter === 'orders')
            return sorted.filter((order) => !order.isQuickSale)
        if (typeFilter === 'quick')
            return sorted.filter((order) => order.isQuickSale)

        return sorted
    }, [orders, typeFilter])

    const handleTypeFilterChange = (value: OrderTypeFilter | null) => {
        const next = value ?? 'all'
        setTypeFilter(next)

        try {
            localStorage.setItem(TYPE_FILTER_STORAGE_KEY, next)
        } catch {}
    }

    if (isLoading) return <p>Carregando pedidos...</p>

    if (error) return <p>Não foi possível carregar os pedidos</p>

    return (
        <section className="container mx-auto space-y-3 py-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        setFilters([{ id: 'customer', value: searchValue }])
                    }}
                >
                    <Input
                        type="search"
                        placeholder="Buscar por cliente"
                        value={searchValue}
                        onChange={({ target }) => setSearchValue(target.value)}
                    />
                    <Button type="submit" variant="secondary">
                        <Search className="text-primary" />
                    </Button>
                </form>
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

            <ChipGroup
                ariaLabel="Filtrar por tipo"
                options={TYPE_FILTER_OPTIONS}
                value={typeFilter}
                onChange={handleTypeFilterChange}
            />

            <DataTable
                columns={orderColumns}
                data={visibleOrders}
                noDataMessage={
                    typeFilter === 'quick'
                        ? 'Nenhuma venda rápida ainda'
                        : 'Nenhum pedido encontrado'
                }
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
                onRowClick={(order) => router.push(`/orders/${order.id}`)}
            />
        </section>
    )
}
