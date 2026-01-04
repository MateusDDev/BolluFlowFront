'use client'

import { DataTable } from 'ui/dataTable'
import { recipeIngredientsColumns } from '@/features/recipes/details/components/molecules/RecipeIngredientsColumns'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useState } from 'react'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { NewRecipeIngredientModal } from '@/features/recipes/details/components/molecules/NewRecipeIngredientModal'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'

type RecipeIngredientsTableProps = {
    recipeIngredients?: RecipeIngredientModel[]
    isLoading: boolean
    error: unknown
}

export function RecipeIngredientsTable({
    recipeIngredients,
    isLoading,
    error,
}: RecipeIngredientsTableProps) {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
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
                <NewRecipeIngredientModal />
            </div>
            <div>
                <DataTable
                    columns={recipeIngredientsColumns}
                    data={recipeIngredients ?? []}
                    noDataMessage="Nenhuma receita encontrada"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}
