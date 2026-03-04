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
import { CreateRecipeIngredientDataType } from '@/features/recipes/services/recipe.api'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { formatQuantityInput } from '@/shared/helpers/formatHelper'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'

export function NewRecipeIngredientModal() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const [open, setOpen] = useState(false)
    const [ingredientId, setIngredientId] = useState('')
    const [quantityUsed, setQuantityUsed] = useState('')

    const { data: ingredients, isLoading } = useGetIngredients()
    const { data: recipeIngredients } = useGetRecipeIngredients(Number(id))
    const {
        mutateAsync: createRecipeIngredient,
        isPending,
        error,
    } = useCreateRecipeIngredient()

    const resetForm = () => {
        setIngredientId('')
        setQuantityUsed('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!ingredientId || !quantityUsed) return

        const normalizedQuantity = Number(quantityUsed.replace(',', '.'))

        if (isNaN(normalizedQuantity) || normalizedQuantity <= 0) return

        const payload: CreateRecipeIngredientDataType = {
            ingredientId: Number(ingredientId),
            quantityUsed: normalizedQuantity,
        }

        await createRecipeIngredient({
            recipeId,
            data: payload,
        })

        resetForm()
        setOpen(false)
    }

    const selectedIngredient = ingredients?.find(
        (ingredient) => ingredient.id.toString() === ingredientId
    )

    const usedIngredientIds = recipeIngredients?.map(
        (ingredient) => ingredient.ingredientId
    )

    const availableIngredients = ingredients?.filter(
        (ingredient) => !usedIngredientIds?.includes(ingredient.id)
    )

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!open) resetForm()
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Adicionar insumo</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar insumo</DialogTitle>
                    <DialogDescription>
                        Selecione o insumo e informe a quantidade usada na
                        receita.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Ingrediente*</Label>

                        <Select
                            value={ingredientId}
                            onValueChange={setIngredientId}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um insumo" />
                            </SelectTrigger>

                            <SelectContent>
                                {availableIngredients?.length ? (
                                    availableIngredients.map((ingredient) => (
                                        <SelectItem
                                            key={ingredient.id}
                                            value={ingredient.id.toString()}
                                        >
                                            {ingredient.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Todos os insumos já foram adicionados
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                            <Label>Quantidade usada*</Label>

                            {selectedIngredient?.baseUnit && (
                                <span className="text-sm text-muted-foreground">
                                    {getMeasurementUnitLabel(
                                        selectedIngredient.baseUnit
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
                                    isPending || !ingredientId || !quantityUsed
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
