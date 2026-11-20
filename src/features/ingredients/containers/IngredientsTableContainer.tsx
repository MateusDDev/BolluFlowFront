'use client'

import { useGetIngredients } from '@/features/ingredients/hooks/queries/useGetIngredients'
import { useModuleColumns } from '@/shared/modules/moduleColumns'
import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { DataTable } from 'ui/dataTable'
import { ingredientsTableColumns } from '@/features/ingredients/components/molecules/Columns'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { NewIngredientModal } from '@/features/ingredients/components/organisms/NewIngredientModal'

export const IngredientsTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const columns = useModuleColumns(ingredientsTableColumns)
    const { data: ingredients, isLoading, error } = useGetIngredients()
    const [searchValue, setSearchValue] = useState<string>('')

    if (isLoading) return <p>Carregando ingredientes...</p>

    if (error) return <p>Não foi possível carregar os ingredientes</p>

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
                <NewIngredientModal />
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={ingredients ?? []}
                    noDataMessage="Nenhum ingrediente encontrado"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}
