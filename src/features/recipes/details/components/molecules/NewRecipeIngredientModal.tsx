'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'

import { useGetIngredients } from '@/features/recipes/details/hooks/queries/useGetIngredients'
import { useCreateRecipeIngredient } from '@/features/recipes/details/hooks/mutations/useCreateRecipeIngredient'
import {
    CreateRecipeIngredientDataType,
    RecipeComponentCatalogItem,
} from '@/features/recipes/services/recipe.api'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { formatQuantityInput } from '@/shared/helpers/formatHelper'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'

export function NewRecipeIngredientModal() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const [open, setOpen] = useState(false)
    const [componentId, setComponentId] = useState('')
    const [quantityUsed, setQuantityUsed] = useState('')

    const { data: components, isLoading } = useGetIngredients(recipeId)
    const { data: recipeIngredients } = useGetRecipeIngredients(Number(id))
    const {
        mutateAsync: createRecipeIngredient,
        isPending,
        error,
    } = useCreateRecipeIngredient()

    const resetForm = () => {
        setComponentId('')
        setQuantityUsed('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!componentId || !quantityUsed) return

        const normalizedQuantity = Number(quantityUsed.replace(',', '.'))

        if (isNaN(normalizedQuantity) || normalizedQuantity <= 0) return

        const selectedComponent = components?.find(
            (component) => component.id.toString() === componentId
        )

        if (!selectedComponent) return

        const payload: CreateRecipeIngredientDataType = {
            quantityUsed: normalizedQuantity,
            componentType: selectedComponent.sourceType,
            ...(selectedComponent.sourceType === 'Ingredient'
                ? { ingredientId: selectedComponent.id }
                : { componentRecipeId: selectedComponent.id }),
        }

        await createRecipeIngredient({
            recipeId,
            data: payload,
        })

        resetForm()
        setOpen(false)
    }

    const selectedComponent = components?.find(
        (component) => component.id.toString() === componentId
    )

    const usedComponentIds = recipeIngredients?.map((ingredient) =>
        ingredient.componentType === 'Recipe'
            ? ingredient.componentRecipeId
            : ingredient.ingredientId
    )

    const availableComponents = components?.filter(
        (component) => !usedComponentIds?.includes(component.id)
    )

    const getComponentLabel = (component: RecipeComponentCatalogItem) =>
        `${component.name} (${component.sourceType === 'Ingredient' ? 'Insumo' : 'Receita'})`

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!open) resetForm()
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Adicionar componente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar componente</DialogTitle>
                    <DialogDescription>
                        Selecione um insumo ou uma receita intermediaria para
                        compor a receita.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Componente*</Label>

                        <Select
                            value={componentId}
                            onValueChange={setComponentId}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um componente" />
                            </SelectTrigger>

                            <SelectContent>
                                {availableComponents?.length ? (
                                    availableComponents.map((component) => (
                                        <SelectItem
                                            key={component.id}
                                            value={component.id.toString()}
                                        >
                                            {getComponentLabel(component)}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Todos os componentes ja foram
                                        adicionados
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                            <Label>Quantidade usada*</Label>

                            {selectedComponent?.baseUnit && (
                                <span className="text-sm text-muted-foreground">
                                    {getMeasurementUnitLabel(
                                        selectedComponent.baseUnit
                                    )}
                                </span>
                            )}
                        </div>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="Ex: 0,5"
                            value={quantityUsed}
                            onChange={(e) =>
                                setQuantityUsed(
                                    formatQuantityInput(e.target.value)
                                )
                            }
                            className="pr-12"
                            required
                        />
                    </div>

                    <DialogFooter className="flex flex-col gap-2">
                        <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={
                                    isPending || !componentId || !quantityUsed
                                }
                            >
                                {isPending ? 'Salvando...' : 'Adicionar'}
                            </Button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">
                                {error.message}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
