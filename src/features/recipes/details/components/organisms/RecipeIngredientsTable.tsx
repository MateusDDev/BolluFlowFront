'use client'

import { DataTable } from 'ui/dataTable'
import { recipeIngredientsColumns } from '@/features/recipes/details/components/molecules/RecipeIngredientsColumns'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export function RecipeIngredientsTable() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)
    const [filters, setFilters] = useState<ColumnFiltersState>([])
    const {
        data: recipeIngredients,
        isLoading,
        error,
    } = useGetRecipeIngredients(recipeId)

    if (isLoading) return <p>Carregando ingredientes...</p>

    if (error) return <p>Não foi possível carregar os ingredientes</p>

    return (
        <section>
            <DataTable
                columns={recipeIngredientsColumns}
                data={recipeIngredients ?? []}
                noDataMessage="Essa receita ainda não possui ingredientes"
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
            />
        </section>
    )
}
