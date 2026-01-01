'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { RecipeIngredientsTable } from '@/features/recipes/details/components/organisms/RecipeIngredientsTable'
import { RecipePricing } from '@/features/recipes/details/components/organisms/RecipePricing'
import { useParams, useRouter } from 'next/navigation'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { useEffect } from 'react'
import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { Button } from 'ui/button'
import { StepBackIcon } from 'lucide-react'
import { RecipeDetails } from '@/features/recipes/details/components/organisms/RecipeDetails'

export function RecipeTabs() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const recipeId = Number(id)

    const { data: recipe } = useGetRecipe(recipeId)
    const { setTitle } = usePageTitle()

    useEffect(() => {
        if (recipe?.name) setTitle(recipe.name)

        return () => setTitle(null)
    }, [recipe, setTitle])

    return (
        <section>
            <Button
                variant="ghost"
                className="h-6 w-6 mb-2"
                onClick={() => router.back()}
            >
                <StepBackIcon className="text-primary" />
            </Button>
            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
                    <TabsTrigger value="pricing">Precificação</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <RecipeDetails />
                </TabsContent>
                <TabsContent value="ingredients">
                    <RecipeIngredientsTable />
                </TabsContent>
                <TabsContent value="pricing">
                    <RecipePricing />
                </TabsContent>
            </Tabs>
        </section>
    )
}
