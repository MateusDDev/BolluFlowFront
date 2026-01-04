'use client'

import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Search } from 'lucide-react'
import { DataTable } from 'ui/dataTable'
import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useGetRecipes } from '@/features/recipes/list/hooks/queries/useGetRecipes'
import { recipeColumns } from '@/features/recipes/list/components/molecules/RecipeColumns'
import { NewRecipeModal } from '@/features/recipes/list/components/organisms/NewRecipeModal'

export const RecipesTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const { data: recipes, isLoading, error } = useGetRecipes()
    const [searchValue, setSearchValue] = useState<string>('')

    if (isLoading) return <p>Carregando receitas...</p>

    if (error) return <p>Não foi possível carregar as receitas</p>

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
                <NewRecipeModal />
            </div>
            <div>
                <DataTable
                    columns={recipeColumns}
                    data={recipes ?? []}
                    noDataMessage="Nenhuma receita encontrada"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                />
            </div>
        </section>
    )
}
