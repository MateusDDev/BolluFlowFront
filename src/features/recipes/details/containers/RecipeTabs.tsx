'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { RecipeIngredientsTable } from '@/features/recipes/details/components/organisms/RecipeIngredientsTable'
import { RecipePricing } from '@/features/recipes/details/components/organisms/RecipePricing'
import { useParams } from 'next/navigation'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { useEffect } from 'react'
import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { RecipeDetails } from '@/features/recipes/details/components/organisms/RecipeDetails'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { BackButton } from 'components/BackButton'

export function RecipeTabs() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const ingredientsQuery = useGetRecipeIngredients(recipeId)

    const { data: recipe } = useGetRecipe(recipeId)
    const { setTitle } = usePageTitle()

    useEffect(() => {
        if (recipe?.name) setTitle(recipe.name)

        return () => setTitle(null)
    }, [recipe, setTitle])

    return (
        <section>
            <Tabs defaultValue="details">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="ingredients">Insumos</TabsTrigger>
                        <TabsTrigger value="pricing">Precificação</TabsTrigger>
                    </TabsList>
                    <BackButton className="[&_svg]:size-6" />
                </div>
                <TabsContent value="details">
                    <RecipeDetails />
                </TabsContent>
                <TabsContent value="ingredients">
                    <RecipeIngredientsTable
                        recipeIngredients={ingredientsQuery.data}
                        isLoading={ingredientsQuery.isLoading}
                        error={ingredientsQuery.error}
                    />
                </TabsContent>
                <TabsContent value="pricing">
                    <RecipePricing />
                </TabsContent>
            </Tabs>
        </section>
    )
}
