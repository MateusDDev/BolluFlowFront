'use client'

import { useGetCustomers } from '@/features/customers/hooks/queries/useGetCustomers'
import { DataTable } from 'ui/dataTable'
import { columns } from '@/features/customers/components/molecules/Columns'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Search, Users } from 'lucide-react'
import { EmptyState } from 'components/EmptyState'
import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import NewCustomerModal from '@/features/customers/components/organisms/NewCustomerModal'

const CustomersTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const { data: customers, isLoading, error } = useGetCustomers()

    if (isLoading) return <p>Carregando clientes...</p>

    if (error) return <p>Não foi possível carregar os clientes</p>

    if (!customers?.length)
        return (
            <section className="container mx-auto py-10">
                <EmptyState
                    icon={Users}
                    title="Seus clientes aparecem aqui"
                    description="Cadastre aqui ou direto ao criar um pedido, só com nome e WhatsApp. Quem pede pelo cardápio online entra sozinho."
                    action={<NewCustomerModal />}
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
                <NewCustomerModal />
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={customers ?? []}
                    noDataMessage="Nenhum cliente encontrado"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}

export default CustomersTableContainer
