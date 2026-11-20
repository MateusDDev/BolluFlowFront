'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { BackButton } from 'components/BackButton'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { RecipeDetails } from '@/features/recipes/details/components/organisms/RecipeDetails'
import { RecipeIngredientsTable } from '@/features/recipes/details/components/organisms/RecipeIngredientsTable'
import { RecipeConversionsSection } from '@/features/recipes/details/components/organisms/RecipeConversionsSection'
import { Button } from 'ui/button'
import { RecipeProductionModal } from '@/features/recipes/list/components/organisms/RecipeProductionModal'

export function RecipeTabs() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const ingredientsQuery = useGetRecipeIngredients(recipeId)

    const { data: recipe } = useGetRecipe(recipeId)
    const [isProductionOpen, setIsProductionOpen] = useState(false)
    const { setTitle } = usePageTitle()

    useEffect(() => {
        if (recipe?.name) setTitle(recipe.name)

        return () => setTitle(null)
    }, [recipe, setTitle])

    return (
        <section>
            <Tabs defaultValue="details">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BackButton />
                        <TabsList>
                            <TabsTrigger value="details">Detalhes</TabsTrigger>
                            <TabsTrigger value="ingredients">
                                Ingredientes
                            </TabsTrigger>
                            <TabsTrigger value="conversions">
                                Conversões
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex items-center gap-2">
                        {recipe && (
                            <Button
                                variant="outline"
                                onClick={() => setIsProductionOpen(true)}
                            >
                                Registrar produção
                            </Button>
                        )}
                    </div>
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

            {recipe && (
                <RecipeProductionModal
                    recipe={recipe}
                    open={isProductionOpen}
                    onOpenChange={setIsProductionOpen}
                />
            )}
        </section>
    )
}
