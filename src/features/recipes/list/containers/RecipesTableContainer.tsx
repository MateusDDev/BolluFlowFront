'use client'

import { Input } from 'ui/input'
import { useModuleColumns } from '@/shared/modules/moduleColumns'
import { Button } from 'ui/button'
import { ChefHat, Search } from 'lucide-react'
import { EmptyState } from 'components/EmptyState'
import { DataTable } from 'ui/dataTable'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useGetRecipes } from '@/features/recipes/list/hooks/queries/useGetRecipes'
import { recipeColumns } from '@/features/recipes/list/components/molecules/RecipeColumns'
import { NewRecipeModal } from '@/features/recipes/list/components/organisms/NewRecipeModal'

export const RecipesTableContainer = () => {
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const columns = useModuleColumns(recipeColumns)
    const { data: recipes, isLoading, error } = useGetRecipes()
    const [searchValue, setSearchValue] = useState<string>('')
    const router = useRouter()

    if (isLoading) return <p>Carregando receitas...</p>

    if (error) return <p>Não foi possível carregar as receitas</p>

    if (!recipes?.length)
        return (
            <section className="container mx-auto py-10">
                <EmptyState
                    icon={ChefHat}
                    title="Cadastre suas receitas base"
                    description="Cadastre uma receita uma vez e use em vários produtos. Quando o preço de um ingrediente muda, o custo de tudo que usa a receita se atualiza sozinho."
                    example="Ex.: Brigadeiro de colher, rende 1 kg"
                    action={<NewRecipeModal />}
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
                <NewRecipeModal />
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={recipes ?? []}
                    noDataMessage="Nenhuma receita encontrada"
                    columnFilters={filters}
                    onColumnFiltersChange={setFilters}
                    onRowClick={(recipe) =>
                        router.push(`/recipes/${recipe.id}`)
                    }
                />
            </div>
        </section>
    )
}
