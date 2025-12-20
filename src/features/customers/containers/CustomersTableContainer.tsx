'use client'

import { useGetCustomers } from '@/features/customers/hooks/queries/useGetCustomers'
import { DataTable } from 'ui/dataTable'
import { columns } from '@/features/customers/components/molecules/Column'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useMe } from '@/features/login/hooks/useMe'
import NewCustomerModal from '@/features/customers/components/organisms/NewCustomerModal'

const CustomersTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const { data: me } = useMe()
    const { data: customers, isLoading, error } = useGetCustomers(me?.id ?? 0)

    if (isLoading) return <p>Carregando clientes...</p>

    if (error) return <p>Não foi possível carregar os clientes</p>

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
