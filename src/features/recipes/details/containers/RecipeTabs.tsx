'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { BackButton } from 'components/BackButton'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { RecipeDetails } from '@/features/recipes/details/components/organisms/RecipeDetails'
import { RecipeIngredientsTable } from '@/features/recipes/details/components/organisms/RecipeIngredientsTable'
import { RecipeConversionsSection } from '@/features/recipes/details/components/organisms/RecipeConversionsSection'

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
                        <TabsTrigger value="ingredients">
                            Ingredientes
                        </TabsTrigger>
                        <TabsTrigger value="conversions">Conversões</TabsTrigger>
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
                <TabsContent value="conversions">
                    <RecipeConversionsSection />
                </TabsContent>
            </Tabs>
        </section>
    )
}
